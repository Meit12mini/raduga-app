// window.addEventListener("load", () => {
//   setTimeout(() => {
//     document
//       .querySelectorAll(".document-conteiner__main__document__img")
//       .forEach((img) => {
//         img.addEventListener("mouseover", (event) => {
//           const zoom = document.createElement("div");
//           zoom.classList.add("zoom");
//           const zoomImg = new Image();
//           zoomImg.src = event.target.src;
//           zoomImg.style.width = "500px";
//           zoomImg.style.height = "500px";
//           zoom.appendChild(zoomImg);
//           document.body.appendChild(zoom);
//           zoom.style.position = "absolute";
//           zoom.style.top = `${event.clientY + 10}px`;
//           zoom.style.left = `${event.clientX + 10}px`;
//         });
//         img.addEventListener("mouseout", () => {
//           document.querySelector(".zoom").remove();
//         });
//       });
//   }, 500);
// });
