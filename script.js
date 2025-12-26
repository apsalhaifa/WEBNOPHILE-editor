let htmlEditor, cssEditor, jsEditor;
let activeEditor = "html";

window.onload = () => {
  const panel = document.querySelector(".editor-panel");

  htmlEditor = CodeMirror(panel, {
    mode: "htmlmixed",
    theme: "material-darker",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true
  });

  cssEditor = CodeMirror(panel, {
    mode: "css",
    theme: "material-darker",
    lineNumbers: true,
    autoCloseBrackets: true
  });

  jsEditor = CodeMirror(panel, {
    mode: "javascript",
    theme: "material-darker",
    lineNumbers: true,
    autoCloseBrackets: true
  });

htmlEditor.setValue(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Web Page</title>
</head>
<body>

  <h1>Hello Webnophile 🚀</h1>
  <p>Edit HTML, CSS, and JS to see live output.</p>

</body>
</html>`);

cssEditor.setValue(`/* Write your CSS here */

body {
  font-family: Arial, sans-serif;
  background-color: #f1f5f9;
  text-align: center;
}

h1 {
  color: #2563eb;
}`);

jsEditor.setValue(`// Write your JavaScript here

console.log("Welcome to Webnophile Compiler!");

document.addEventListener("click", () => {
  console.log("You clicked the page");
});`);


  cssEditor.getWrapperElement().style.display = "none";
  jsEditor.getWrapperElement().style.display = "none";

  setupResizer();
  runCode();

  setTimeout(() => htmlEditor.focus(), 300);

  document.getElementById("themeToggle").onclick = toggleTheme;
};

function openTab(type, btn) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  htmlEditor.getWrapperElement().style.display = "none";
  cssEditor.getWrapperElement().style.display = "none";
  jsEditor.getWrapperElement().style.display = "none";

  activeEditor = type;
  const ed = type === "html" ? htmlEditor : type === "css" ? cssEditor : jsEditor;
  ed.getWrapperElement().style.display = "block";
  ed.refresh();
  ed.focus();
}

function runCode() {
  document.getElementById("output").srcdoc = `
<!DOCTYPE html>
<html>
<head>
<style>${cssEditor.getValue()}</style>
</head>
<body>
${htmlEditor.getValue()}
<script>${jsEditor.getValue()}<\/script>
</body>
</html>`;
}

function saveProject() {
  localStorage.setItem("html", htmlEditor.getValue());
  localStorage.setItem("css", cssEditor.getValue());
  localStorage.setItem("js", jsEditor.getValue());
  document.getElementById("console").innerText = "Saved ✔";
}

function shareCode() {
  navigator.clipboard.writeText(location.href);
  document.getElementById("console").innerText = "Link copied ✔";
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  const theme = light ? "eclipse" : "material-darker";

  htmlEditor.setOption("theme", theme);
  cssEditor.setOption("theme", theme);
  jsEditor.setOption("theme", theme);

  document.getElementById("themeToggle").innerText = light ? "🌙" : "☀️";
}

function setupResizer() {
  const resizer = document.getElementById("resizer");
  const left = document.querySelector(".editor-panel");
  const right = document.getElementById("output");
  let dragging = false;

  resizer.addEventListener("mousedown", startDrag);
  resizer.addEventListener("touchstart", startDrag);

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);

  function startDrag(e) {
    dragging = true;
    document.body.style.userSelect = "none";
  }

  function stopDrag() {
    dragging = false;
    document.body.style.userSelect = "auto";
  }

  function drag(e) {
    if (!dragging) return;

    if (window.innerWidth > 768) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const total = document.querySelector(".workspace").offsetWidth;
      const percent = (x / total) * 100;

      if (percent > 20 && percent < 80) {
        left.style.flex = `0 0 ${percent}%`;
        right.style.flex = `0 0 ${100 - percent}%`;
      }
    } else {
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const total = document.querySelector(".workspace").offsetHeight;
      const percent = (y / total) * 100;

      if (percent > 30 && percent < 70) {
        left.style.height = percent + "%";
        right.style.height = 100 - percent + "%";
      }
    }

    htmlEditor.refresh();
    cssEditor.refresh();
    jsEditor.refresh();
  }
}

