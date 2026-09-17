from pathlib import Path
import re
import zipfile

base = Path(r"C:\Users\28427\Desktop\test")
out_dir = base / "_extracted"
out_dir.mkdir(exist_ok=True)

docx = base / "2-毕业设计（论文）任务书.docx"
pdf = base / "5-文具售卖说明书.pdf"

# Extract docx text from document.xml
try:
    with zipfile.ZipFile(docx, "r") as z:
        xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
    text = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml))
    (out_dir / "task_docx.txt").write_text(text, encoding="utf-8", errors="ignore")
    print("OK: extracted docx text -> _extracted\\task_docx.txt")
except Exception as e:
    print(f"DOCX extract failed: {e}")

# Extract pdf text if PyPDF2 is available
try:
    import PyPDF2

    reader = PyPDF2.PdfReader(str(pdf))
    pages = [(p.extract_text() or "") for p in reader.pages]
    (out_dir / "stationery_pdf.txt").write_text("\n\n".join(pages), encoding="utf-8", errors="ignore")
    print("OK: extracted pdf text -> _extracted\\stationery_pdf.txt")
except Exception as e:
    print(f"PDF extract failed: {e}")
