const PRACTICE_MODES = [
  { id: "diagnostic", title: "Diagnostic Test", goal: "Find your weak keys, words, rhythm, and accuracy pattern.", bank: "balanced" },
  { id: "accuracy", title: "Accuracy Builder", goal: "Slow down, reduce mistakes, and build cleaner typing control.", bank: "common" },
  { id: "speed", title: "Speed Builder", goal: "Practice short familiar words to build faster flow.", bank: "speed" },
  { id: "punctuation", title: "Punctuation Control", goal: "Improve commas, periods, quotes, and capitalization.", bank: "punctuation" },
  { id: "numbers", title: "Number Row", goal: "Build confidence with mixed numbers and symbols.", bank: "numbers" },
  { id: "code", title: "Code-Like Typing", goal: "Practice mixed programming syntax, brackets, spacing, and exact symbols.", bank: "code" },
  { id: "email", title: "Email Typing", goal: "Practice workplace paragraphs with natural punctuation.", bank: "email" },
  { id: "notes", title: "Notes Mode", goal: "Practice concise note-style writing and repeated phrases.", bank: "notes" },
  { id: "data", title: "Data Entry", goal: "Practice names, quantities, dates, and short records.", bank: "data" }
];

const TEXT_BANKS = {
  balanced: [
    "Clear typing depends on rhythm, accuracy, and attention. A useful practice session should reveal where your speed drops and which keys cause avoidable mistakes.",
    "Most people improve faster when they stop chasing only speed. Clean letters, steady spacing, and fewer corrections create better typing over time.",
    "A calm typing test can still be challenging. The goal is to notice patterns, repair weak spots, and leave with one focused drill for the next round.",
    "Consistent practice works best when each round has a purpose. A short test can show whether mistakes come from speed, unfamiliar words, or tired focus.",
    "Good typing feels quiet and controlled. The hands move with less tension, the eyes look ahead, and corrections become less frequent.",
    "Progress is easier to trust when it is measured over time. One fast round is exciting, but steady accuracy creates lasting improvement."
  ],
  common: [
    "the quick brown fox jumps over the lazy dog while the quiet reader checks each word with patient care",
    "because people often improve through steady practice every clean sentence becomes a small useful repetition",
    "different results appear when accuracy comes first and speed grows naturally from familiar movement",
    "simple sentences provide the best foundation for building speed without becoming overwhelmed by punctuation",
    "many common phrases repeat often enough that your hands learn to type them as a single smooth motion",
    "strong accuracy gives every speed drill a better foundation because fewer mistakes interrupt the flow"
  ],
  speed: [
    "time work hand place point small right great long little world home number group problem fact",
    "make take give look find come know think feel move turn start keep call show help",
    "fast clear short words help fingers build a steady flow without heavy punctuation or long pauses",
    "day play say way may line mine sign fine mind kind bind wind find blind",
    "quick quiet quite question queen quote quality equal request require",
    "green screen seen clean mean lean bean team stream dream cream"
  ],
  punctuation: [
    "When the meeting ended, Riya said, \"Send the final notes before 5:30.\" Everyone agreed, but nobody moved.",
    "Accuracy matters: commas, periods, quotes, and capital letters all change how professional typing feels.",
    "Before you submit the report, check three things: spelling, punctuation, and spacing.",
    "The manager asked, 'Are we ready to launch?' The team replied, 'Yes, everything is deployed!'",
    "Please label the folders as follows: \"Current\", \"Archive\", \"Pending\", and \"Final\".",
    "A strong sentence uses punctuation carefully: not too much, not too little, and always with intent."
  ],
  numbers: [
    "Order 1042 includes 18 notebooks, 7 markers, 24 clips, and 3 folders for Room 205.",
    "The invoice total changed from 1499 to 1575 after adding 6 items and removing 2 duplicates.",
    "Call logs show 12 requests at 09:30, 18 requests at 11:45, and 9 requests after 16:00.",
    "Flight 8472 departs from Gate 45 at 18:20, arriving in Terminal 3 around 21:55 local time.",
    "Batch 7812 passed 94 tests, failed 3 checks, and has 2 warnings pending review.",
    "Customer ID 71845 ordered 3 units on 11 Jun 2026 with priority level 2."
  ],
  code: [
    "public class Main { public static void main(String[] args) { System.out.println(\"Hello, Java\"); } }",
    "for (int i = 0; i < items.length; i++) { total += items[i].getPrice(); }",
    "if (user != null && user.isActive()) { service.sendWelcomeEmail(user.getEmail()); }",
    "try { int value = Integer.parseInt(input); } catch (NumberFormatException ex) { value = 0; }",
    "def calculate_total(items): return sum(item[\"price\"] for item in items if item[\"active\"])",
    "for index, word in enumerate(words): print(f\"{index}: {word.strip().lower()}\")",
    "with open(\"report.txt\", \"w\", encoding=\"utf-8\") as file: file.write(summary)",
    "const total = items.filter(item => item.active).reduce((sum, item) => sum + item.price, 0);",
    "async function loadUser(id) { const res = await fetch(`/api/users/${id}`); return res.json(); }",
    "SELECT name, email, created_at FROM users WHERE status = 'active' ORDER BY created_at DESC;",
    "UPDATE orders SET status = 'shipped', shipped_at = NOW() WHERE id = 1042;",
    "fn greet(name: &str) -> String { format!(\"Hello, {}\", name) }",
    "package main; import \"fmt\"; func main() { fmt.Println(\"Hello from Go\") }",
    "foreach (var item in items) { if (item.IsActive) total += item.Price; }",
    "docker compose up -d api worker postgres redis",
    "val filtered = users.filter { it.isActive }.map { it.email }.sorted()"
  ],
  email: [
    "Hi Anika, I reviewed the draft and added comments to the second section. Please check the numbers before sending the final version.",
    "Good morning team, today's priority is to finish the layout review, test the form, and prepare a short update by 4 PM.",
    "Thanks for your message. I can join the call tomorrow afternoon and share the revised notes before the discussion.",
    "Hi team, the build is ready for testing. Please report any major issues in the tracker with screenshots attached.",
    "Hello everyone, please check the updated schedule and confirm your availability for the review session."
  ],
  notes: [
    "Meeting notes: confirm design direction, update task list, review accessibility, test keyboard flow, prepare final screenshots.",
    "Study plan: revise definitions, solve five examples, summarize weak topics, practice typing notes for fifteen minutes.",
    "Project checklist: clean layout, focused interactions, useful feedback, local storage, simple navigation, final testing.",
    "Bug review: reproduce issue, check console, inspect recent changes, isolate cause, write small fix.",
    "Launch checklist: verify build, test login, review analytics, update README, package final version."
  ],
  data: [
    "Aarav Mehta, ID 2048, 12 units, due 14 May 2026, status pending.",
    "Neha Rao, ID 3187, 6 units, due 21 May 2026, status complete.",
    "Kiran Shah, ID 1576, 9 units, due 28 May 2026, status review.",
    "Liam Johnson, ID 8492, 3 units, due 02 Jun 2026, status shipped.",
    "Emma Williams, ID 4710, 15 units, due 10 Jun 2026, status processing."
  ]
};

const SMART_WORDS = {
  a: ["accurate", "again", "analysis", "available", "average"],
  e: ["effort", "either", "example", "exercise", "excellent"],
  i: ["improve", "inside", "initial", "typing", "discipline"],
  o: ["control", "common", "motion", "focus", "progress"],
  r: ["rhythm", "record", "reduce", "repair", "result"],
  s: ["steady", "spacing", "session", "speed", "support"],
  t: ["target", "training", "better", "pattern", "consistent"],
  n: ["number", "natural", "clean", "attention", "confidence"]
};
