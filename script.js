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

  resizer.onmousedown = () => {
    dragging = true;
    document.body.style.userSelect = "none";
  };

  document.onmouseup = () => {
    dragging = false;
    document.body.style.userSelect = "auto";
  };

  document.onmousemove = e => {
    if (!dragging) return;

    const total = document.querySelector(".workspace").offsetWidth;
    const leftWidth = (e.clientX / total) * 100;

    if (leftWidth > 20 && leftWidth < 80) {
      left.style.flex = `0 0 ${leftWidth}%`;
      right.style.flex = `0 0 ${100 - leftWidth}%`;

      htmlEditor.refresh();
      cssEditor.refresh();
      jsEditor.refresh();
    }
  };
}
