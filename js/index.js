// TODO: TIL 폼 등록 기능을 구현하세요
// 1. 폼 요소와 목록 요소를 querySelector로 선택합니다.
// 2. 폼의 submit 이벤트를 감지하여 새 TIL 항목을 목록에 추가합니다.

const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const expForm = document.querySelector("#exp-form");
const expList = document.querySelector("#exp-list");

// 페이지 로드 시 오늘 날짜를 기본값으로 세팅
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.querySelector("#til-date").value = today;
  document.querySelector("#exp-date").value = today;
});

// 2. TIL 등록 기능
tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const dateValue = document.querySelector("#til-date").value;
  const titleValue = document.querySelector("#til-title").value;
  const contentValue = document.querySelector("#til-content").value;

  const newArticle = document.createElement("article");
  newArticle.className = "til-item";

  newArticle.innerHTML = `
            <div class="til-actions">
                <button class="action-btn edit-btn">수정</button>
                <button class="action-btn delete-btn">삭제</button>
            </div>
            <time>${dateValue}</time>
            <h3 class="til-item-title">${titleValue}</h3>
            <p class="til-item-content">${contentValue}</p>
        `;

  tilList.prepend(newArticle);
  tilForm.reset();

  const today = new Date().toISOString().split("T")[0];
  document.querySelector("#til-date").value = today;
});

// 3. TIL 수정/삭제 기능
tilList.addEventListener("click", function (e) {
  const article = e.target.closest(".til-item");
  if (!article) return;

  // 삭제 기능
  if (e.target.classList.contains("delete-btn")) {
    if (e.target.textContent === "삭제") {
      e.target.textContent = "진짜 삭제?";
      e.target.style.backgroundColor = "#b71c1c";
      setTimeout(() => {
        if (e.target && e.target.textContent === "진짜 삭제?") {
          e.target.textContent = "삭제";
          e.target.style.backgroundColor = "";
        }
      }, 3000);
    } else {
      article.remove();
    }
  }
  // 수정 기능
  else if (e.target.classList.contains("edit-btn")) {
    const titleEl = article.querySelector(".til-item-title");
    const contentEl = article.querySelector(".til-item-content");

    const currentTitle = titleEl.textContent;
    const currentContent = contentEl.textContent;

    titleEl.outerHTML = `<input type="text" class="edit-title" value="${currentTitle}">`;
    contentEl.outerHTML = `<textarea class="edit-content" rows="3">${currentContent}</textarea>`;

    e.target.textContent = "저장";
    e.target.classList.replace("edit-btn", "save-btn");
  }
  // 저장 기능
  else if (e.target.classList.contains("save-btn")) {
    const titleInput = article.querySelector(".edit-title");
    const contentInput = article.querySelector(".edit-content");

    const newTitle = titleInput.value;
    const newContent = contentInput.value;

    titleInput.outerHTML = `<h3 class="til-item-title">${newTitle}</h3>`;
    contentInput.outerHTML = `<p class="til-item-content">${newContent}</p>`;

    e.target.textContent = "수정";
    e.target.classList.replace("save-btn", "edit-btn");
  }
});

// 4. 특별한 경험 등록 기능 (파일 첨부)
expForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dateValue = document.querySelector("#exp-date").value;
  const titleValue = document.querySelector("#exp-title").value;
  const contentValue = document.querySelector("#exp-content").value;
  const fileInput = document.querySelector("#exp-img-files");

  const newArticle = document.createElement("article");
  newArticle.className = "til-item";
  newArticle.style.borderLeftColor = "#3498db";

  let imgHtml = "";
  if (fileInput.files && fileInput.files.length > 0) {
    imgHtml = '<div class="exp-images">';
    const readPromises = Array.from(fileInput.files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    const dataUrls = await Promise.all(readPromises);
    dataUrls.forEach((url) => {
      imgHtml += `<img src="${url}" alt="">`;
    });
    imgHtml += "</div>";
  }

  newArticle.innerHTML = `
              <div class="til-actions">
                  <button class="action-btn edit-btn">수정</button>
                  <button class="action-btn delete-btn">삭제</button>
              </div>
              <time>${dateValue}</time>
              <h3 class="til-item-title">${titleValue}</h3>
              <p class="til-item-content">${contentValue}</p>
              ${imgHtml}
          `;

  expList.prepend(newArticle);
  expForm.reset();

  const today = new Date().toISOString().split("T")[0];
  document.querySelector("#exp-date").value = today;
});

// 5. 특별한 경험 수정/삭제 기능
expList.addEventListener("click", async function (e) {
  const article = e.target.closest(".til-item");
  if (!article) return;

  // 삭제 기능
  if (e.target.classList.contains("delete-btn")) {
    if (e.target.textContent === "삭제") {
      e.target.textContent = "진짜 삭제?";
      e.target.style.backgroundColor = "#b71c1c";
      setTimeout(() => {
        if (e.target && e.target.textContent === "진짜 삭제?") {
          e.target.textContent = "삭제";
          e.target.style.backgroundColor = "";
        }
      }, 3000);
    } else {
      article.remove();
    }
  }
  // 수정 기능
  else if (e.target.classList.contains("edit-btn")) {
    const titleEl = article.querySelector(".til-item-title");
    const contentEl = article.querySelector(".til-item-content");

    const currentTitle = titleEl.textContent;
    const currentContent = contentEl.textContent;

    titleEl.outerHTML = `<input type="text" class="edit-title" value="${currentTitle}">`;
    contentEl.outerHTML = `<textarea class="edit-content" rows="3">${currentContent}</textarea>`;

    const imgEditHtml = `
                  <div class="edit-image-controls" style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 4px; border: 1px solid #ddd;">
                      <div style="font-size: 0.85rem; margin-bottom: 5px; color: #555;">📷 사진 수정 (새 사진 선택 시 기존 사진 교체)</div>
                      <input type="file" class="edit-img-files" accept="image/*" multiple style="margin-bottom: 10px; font-size: 0.85rem; width: 100%;">
                      <div>
                          <label style="font-size: 0.85rem; color: #d32f2f; cursor: pointer;">
                              <input type="checkbox" class="delete-img-check"> 기존 사진 모두 삭제하기
                          </label>
                      </div>
                  </div>
              `;
    article
      .querySelector(".edit-content")
      .insertAdjacentHTML("afterend", imgEditHtml);

    e.target.textContent = "저장";
    e.target.classList.replace("edit-btn", "save-btn");
  }
  // 저장 기능
  else if (e.target.classList.contains("save-btn")) {
    const titleInput = article.querySelector(".edit-title");
    const contentInput = article.querySelector(".edit-content");
    const fileInput = article.querySelector(".edit-img-files");
    const deleteCheck = article.querySelector(".delete-img-check");
    const controlsDiv = article.querySelector(".edit-image-controls");
    let imagesContainer = article.querySelector(".exp-images");

    const newTitle = titleInput.value;
    const newContent = contentInput.value;

    let newImagesHtml = "";
    let shouldReplaceImages = false;

    if (deleteCheck && deleteCheck.checked) {
      shouldReplaceImages = true;
    } else if (fileInput && fileInput.files.length > 0) {
      shouldReplaceImages = true;
      const readPromises = Array.from(fileInput.files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      });

      const dataUrls = await Promise.all(readPromises);
      if (dataUrls.length > 0) {
        newImagesHtml = '<div class="exp-images">';
        dataUrls.forEach((url) => {
          newImagesHtml += `<img src="${url}" alt="">`;
        });
        newImagesHtml += "</div>";
      }
    }

    titleInput.outerHTML = `<h3 class="til-item-title">${newTitle}</h3>`;
    contentInput.outerHTML = `<p class="til-item-content">${newContent}</p>`;

    if (controlsDiv) controlsDiv.remove();

    if (shouldReplaceImages) {
      if (imagesContainer) {
        imagesContainer.outerHTML = newImagesHtml;
      } else if (newImagesHtml) {
        article.insertAdjacentHTML("beforeend", newImagesHtml);
      }
    }

    e.target.textContent = "수정";
    e.target.classList.replace("save-btn", "edit-btn");
  }
});
