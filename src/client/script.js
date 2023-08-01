const generateForm = document.getElementById("generateForm");
const formContainer = document.getElementById('form-container')
const getImageSection = document.getElementById("getImageSection");
const resultDiv = document.getElementById("result");
const apiUrl = "https://api.neural.love/v1/ai-art";
const apiKey =
  "v1.268cd937e6822c3375ece13b5ad34680ea8cb252501e6b27a5629fb00bc01eb0";

function generateRandomString(minLength, maxLength) {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }

  return randomString;
}

formContainer.style.display = 'none'; // hide form 


let generatedS3Url;
let urlPathToUploadFile;
async function generateS3Url() {
  let headersList = {
    Accept: "*/*",
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    extension: "jpg",
    contentType: "image/jpeg",
    batchId: generateRandomString(32, 64),
  });

  let response = await fetch("https://api.neural.love/v1/upload", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  const data = await response.json();
  generatedS3Url = data.s3Url;
  urlPathToUploadFile = data.url;

  console.log(generatedS3Url);
  if (generatedS3Url && urlPathToUploadFile) {
    document.getElementById("upload-image-container").innerHTML = `
        <input type="file" name="reference image" id="referenceImageFile">
        <button id="upload">upload</button>
        `;

    document.getElementById("upload").addEventListener("click", uploadFile);
  }
}

generateS3Url();
function getQueryParam(url, paramName) {
  const paramIndex = url.indexOf(paramName + "=");
  if (paramIndex === -1) return null;

  const valueStart = paramIndex + paramName.length + 1;
  const valueEnd = url.indexOf("&", valueStart);
  const value =
    valueEnd === -1
      ? url.substr(valueStart)
      : url.substring(valueStart, valueEnd);

  return value;
}

function uploadImageToURL(url, imageFiles) {
  const headers = new Headers();

  const formData = new FormData();
  for (const file of imageFiles) {
      formData.append("file", file);
  }

  try{

      fetch(url, {
          method: "PUT",
          headers: headers,
          body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Image upload failed.");
            }
            return response.text();
        })
        .then((data) => {
            console.log("Image uploaded successfully:", data);
            formContainer.style.display = 'block'; // show form 
            // Handle the response data as needed
        })
        .catch((error) => {
            console.error("Error uploading image:", error);
        });
    } catch (err) {
        console.log(err)
    }
}

function uploadFile(e) {
    e.preventDefault();
  const fileInput = document.getElementById("referenceImageFile");
  const file = fileInput.files;

  const imageUrl = "http://127.0.0.1:4000/uploadImage?uploadUrl=" + escape(urlPathToUploadFile) ;

// const imageUrl = urlPathToUploadFile
  if (!file) {
    console.error("No image selected.");
    return;
  }
  uploadImageToURL(imageUrl, file);
}

generateForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Show the loader while the image is being generated
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  const style = document.getElementById("style").value;
  // const layout = document.getElementById("layout").value;
  const layout = "square";
  const prompt = document.getElementById("prompt").value;

  

  if (!style || !layout || !prompt) {
    alert("Please fill in all the fields.");
    // Hide the loader if there's an error
    loader.style.display = "none";
    return;
  }

  // sent to the API
  const data = {
    amount: 1,
    style: style,
    layout: layout,
    prompt: prompt,
    imageUrl: generatedS3Url,
  };
  const generateOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  };

  fetch(`${apiUrl}/generate`, generateOptions)
    .then((response) => response.json())
    .then((response) => {
      const orderId = response.orderId;
      const price = response.price.amount;
      formContainer.style.display = 'none'; // hide form 

      const getImageBtn = document.createElement("button");
      getImageBtn.textContent = "Get Generated Image";
      getImageBtn.addEventListener("click", function () {
        const getImageOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: `Bearer ${apiKey}`,
          },
        };

        fetch(`${apiUrl}/orders/${orderId}`, getImageOptions)
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.status.isReady) {
              const outputImages = responseData.output;
              const imagesContainer = document.getElementById("result");
              imagesContainer.innerHTML = ""; // clear old result
              // Loop through the output images and display them
              for (const image of outputImages) {
                const imageUrl = image.full;
                const imageCaption = image.caption;

                // Create an image element
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = imageCaption;

                // Create a paragraph element to display the caption
                const captionElement = document.createElement("p");
                captionElement.textContent = imageCaption;

                // Append the image and caption to the container
                imagesContainer.appendChild(imgElement);
                imagesContainer.appendChild(captionElement);
              }
            } else {
              // Display a message if the response is not ready
              const imagesContainer = document.getElementById("result");
              imagesContainer.textContent =
                "The images are not ready yet. Click on 'Get Generated Image' after some time.";
            }
          })
          .catch((err) => console.error(err));
      });

      getImageSection.innerHTML = `Order ID: ${orderId}<br>Price: ${price} ${response.price.currency}`;
      getImageSection.appendChild(getImageBtn);

      loader.style.display = "none";
    })
    .catch((err) => console.error(err));
});
