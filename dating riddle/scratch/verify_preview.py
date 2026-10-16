with open('demo-preview/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = [
    'generateDynamicIcebreakerOptions',
    'generateDynamicReplies',
    'generateDynamicRescue',
    'generateDynamicRewrite',
    'oninput="generateIcebreakers()"',
    'oninput="generateReplyCoach()"',
    'oninput="generateRescue()"',
    'oninput="generateRewrite()"',
    'oninput="generateBios()"',
    'setVibe(v)',
    'setPlatform(p)',
    'setIntent(intent)'
]

all_passed = True
for c in checks:
    count = html.count(c)
    print(f'{c}: found {count} times')
    if count == 0:
        all_passed = False

if all_passed:
    print('ALL CHECKS PASSED SUCCESSFULLY!')
else:
    print('SOME CHECKS FAILED!')
