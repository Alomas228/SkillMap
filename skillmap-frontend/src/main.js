// src/main.js
import { renderMatrixPage } from "./pages/matrix.js";
import "./styles/main.scss";
import "./styles/profile.scss";
import "./styles/matrix.scss";

document.addEventListener('DOMContentLoaded', () => {
    renderMatrixPage();  // ← сразу показывает матрицу
});