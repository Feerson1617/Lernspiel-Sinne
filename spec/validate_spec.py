"""Validate the teaching specification, NOT an implementation of the game.
Usage: python validate_spec.py
No external dependencies. This does not claim that the future answer engine works.
"""
from pathlib import Path
import json
from collections import Counter

ROOT=Path(__file__).resolve().parent

def load(name):
    with (ROOT/name).open(encoding='utf-8') as f:return json.load(f)

def main():
    bank=load('aufgabenbank.json'); rules=load('korrekturregeln.json'); cases=load('golden-tests.json')['cases']
    tasks=bank['tasks']; levels=['Foerder','ESA','MSA','AHR']
    assert len(tasks)==24
    assert {t['id'] for t in tasks}=={f'T{i:02}' for i in range(1,25)}
    assert Counter(t['area'] for t in tasks)=={1:6,2:6,3:6,4:6}
    assert Counter(t['classification'] for t in tasks)=={'P':12,'Z':12}
    expected_ear_F={'Ohrmuschel','Gehörgang','Trommelfell','Gehörknöchelchen','Hörnerv'}
    expected_ear_E={'Trommelfell','Hammer','Amboss','Steigbügel','Hörschnecke','Hörnerv','Gleichgewichtsorgan'}
    expected_eye_F={'Hornhaut','Pupille','Linse','Glaskörper','Netzhaut'}
    expected_eye_E=expected_eye_F|{'Iris','Sehnerv'}
    ids=set();fields={};summary={};closed_count=0
    def validate_step(s,level):
        nonlocal closed_count
        assert s['id'] not in ids, s['id'];ids.add(s['id']);fields[s['id']]=s
        assert s['prompt'].strip();assert len(s['hints'])==2 and all(s['hints'])
        assert s['feedbackCorrect'].strip() and s['feedbackIncorrect'].strip()
        if level in ['Foerder','ESA']:assert s['type'] not in ['bounded_text','anatomy_recall']
        if s['type']=='single_choice':
            closed_count+=1
            choices=[o['id'] for o in s['options']]
            assert len(choices)==len(set(choices))>=2
            assert s['correctOptionId'] in choices
            if level=='Foerder':assert len(choices)<=3
        if 'pairs' in s:
            assert len({p['targetId'] for p in s['pairs']})==len(s['pairs'])
            assert len({p['answerId'] for p in s['pairs']})==len(s['pairs'])
            if s['type'].startswith('anatomy_'):
                assert set(s['perTargetFeedback'])=={p['targetId'] for p in s['pairs']}
                assert all(s['perTargetFeedback'][p['targetId']].get('correct') for p in s['pairs'])
        if 'cards' in s:
            keys=[c['id'] for c in s['cards']]
            assert len(keys)==len(set(keys))
            assert set(keys)==set(s['correctOrder'])
        if s['type']=='bounded_text':
            assert s['ruleId'] in rules['rules']
            assert s.get('fallback') and s['fallback']['type']=='single_choice'
            assert s['hardInputLimit']>=s['maxExpectedCharacters']
        if 'fallback' in s:validate_step(s['fallback'],level)
    for t in tasks:
        assert set(t['variants'])==set(levels)
        for level,v in t['variants'].items():
            assert v['steps'];assert v['targetSeconds']>0
            assert v['assessedUnits']==sum(s['units'] for s in v['steps'])
            for s in v['steps']:validate_step(s,level)
            if t['id'] in ['T03','T07']:
                actual={p['answerText'] for p in v['steps'][0]['pairs']}
                expected=(expected_ear_F if level=='Foerder' else expected_ear_E) if t['id']=='T03' else (expected_eye_F if level=='Foerder' else expected_eye_E)
                assert actual==expected,(t['id'],level,actual)
                assert all(p in rules['anatomyLexicon'] for p in actual)
            if t['id']=='T19':
                step=v['steps'][0]
                assert [c['text'] for c in step['cards']]==['Ohr','Hörnerv','Gehirn','Nerven zu den Beinmuskeln','Beinmuskeln']
                assert step['fixedStart'] and step['fixedEnd']
    for l in levels:
        p=sum(t['variants'][l]['assessedUnits'] for t in tasks if t['classification']=='P')
        z=sum(t['variants'][l]['assessedUnits'] for t in tasks if t['classification']=='Z')
        seconds=sum(t['variants'][l]['targetSeconds'] for t in tasks)
        assert z>=p,(l,p,z)
        assert seconds+270<=1800,(l,seconds)
        summary[l]={'P_units':p,'Z_units':z,'planned_task_seconds':seconds,'planned_total_seconds_including_270s_buffer':seconds+270}
    assert len(cases)>=100
    assert len({c['id'] for c in cases})==len(cases)
    seen={}
    for c in cases:
        assert c['itemRef'] in fields,c['itemRef']
        assert c['ruleId'] in rules['rules']
        assert c['expected'] in rules['stateEnum']+rules['inputEvents']
        key=(c['ruleId'],c['itemRef'],c.get('targetId'),c['answer'])
        assert key not in seen or seen[key]==c['expected'],'Conflicting expected result'
        seen[key]=c['expected']
        if c['ruleId']=='ANATOMY':
            assert c['targetId'] in {p['targetId'] for p in fields[c['itemRef']]['pairs']}
        else:assert fields[c['itemRef']]['ruleId']==c['ruleId']
        if c['expected']=='too_long':assert len(c['answer'])>fields[c['itemRef']]['hardInputLimit']
    report={'what_was_tested':'Teaching data, references, declared coverage and test-case consistency. NOT the game or an answer evaluator.',
        'status':'passed','task_count':len(tasks),'resolved_level_variants':sum(len(t['variants']) for t in tasks),
        'top_level_steps':sum(len(v['steps']) for t in tasks for v in t['variants'].values()),
        'closed_choice_steps_including_fallbacks':closed_count,'golden_expected_cases':len(cases),
        'exact_distinct_golden_inputs':len(seen),'expected_states':dict(Counter(c['expected'] for c in cases)),
        'level_summary':summary,'not_tested':['Running game','Actual evaluator','SVG anatomy after rendering','Real iPad/Safari','Classroom completion times']}
    (ROOT/'validierungsbericht.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
