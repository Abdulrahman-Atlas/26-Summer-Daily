import datetime
from docx import Document

dates = []
current_date = datetime.date(2026, 6, 22)
target_count = 30
holiday = datetime.date(2026, 7, 15)

while len(dates) < target_count:
    if current_date.weekday() < 5 and current_date != holiday:
        dates.append(current_date.strftime("%d/%m/%Y"))
    current_date += datetime.timedelta(days=1)

print("Dates generated:", len(dates))
for i, d in enumerate(dates):
    print(f"Day {i+1}: {d}")

doc = Document("Internship Report.docx")

modified = 0
for table in doc.tables:
    for row in table.rows:
        text0 = row.cells[0].text.strip()
        if text0.isdigit():
            day_num = int(text0)
            if 1 <= day_num <= 30:
                row.cells[1].text = dates[day_num - 1]
                modified += 1

print(f"Modified {modified} rows.")
doc.save("Internship Report.docx")

