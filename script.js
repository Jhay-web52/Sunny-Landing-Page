  // Add your unique Firebase configuration object here
      const firebaseConfig = {
        apiKey: "AIzaSyBaIQr26cl_OkyFyjdawNs52AWUYGK_gzs",
        authDomain: "my-website-ae15f.firebaseapp.com",
        projectId: "my-website-ae15f",
        storageBucket: "my-website-ae15f.firebasestorage.app",
        messagingSenderId: "176239994066",
        appId: "1:176239994066:web:d18df2665b9b842d60790b",
        measurementId: "G-8XFYCBG5HY",
      };

      // Initialize Firebase
      const app = firebase.initializeApp(firebaseConfig);
      const db = app.firestore();

      // =================================================================
      // Testimonial Logic
      // =================================================================

      // Function to fetch and display testimonials from Firestore
      async function fetchAndDisplayTestimonials() {
        const testimonialsContainer = document.getElementById(
          "testimonialsContainer"
        );
        if (!testimonialsContainer) return;
        testimonialsContainer.innerHTML = "";

        try {
          const testimonialsRef = db
            .collection("testimonials")
            .orderBy("createdAt", "desc");
          const snapshot = await testimonialsRef.get();

          if (snapshot.empty) {
            testimonialsContainer.innerHTML =
              '<p style="text-align: center; color: white;">No testimonials yet. Be the first to add one!</p>';
            return;
          }

          snapshot.docs.forEach((doc) => {
            const testimonial = doc.data();
            const initials = testimonial.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            const card = document.createElement("div");
            card.className = "testimonial-card";
            card.innerHTML = `
              <p class="testimonial-text">"${testimonial.comment}"</p>
              <div class="testimonial-author">
                <div class="author-avatar">${initials}</div>
                <div class="author-name">${testimonial.name}</div>
              </div>
            `;
            testimonialsContainer.appendChild(card);
          });
        } catch (error) {
          console.error("Error fetching testimonials:", error);
        }
      }

      // Handle testimonial form submission to send data to Firestore
      const testimonialForm = document.getElementById("testimonialForm");
      if (testimonialForm) {
        testimonialForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const name = testimonialForm.querySelector('input[name="name"]').value;
          const comment = testimonialForm.querySelector(
            'textarea[name="comment"]'
          ).value;

          if (!name || !comment) {
            alert("Please fill in both your name and testimonial.");
            return;
          }

          try {
            await db.collection("testimonials").add({
              name: name,
              comment: comment,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            alert("Thank you for your testimonial!");
            testimonialForm.reset();
            fetchAndDisplayTestimonials();
          } catch (error) {
            console.error("Error adding testimonial:", error);
            alert("Oops! There was a problem submitting your testimonial.");
          }
        });
      }

      // =================================================================
      // Project Like Logic (New)
      // =================================================================

      // Function to fetch and display project likes from Firestore
      async function fetchAndDisplayLikes() {
        try {
          const likesRef = db.collection("projectLikes");
          const snapshot = await likesRef.get();

          snapshot.docs.forEach((doc) => {
            const projectId = doc.id;
            const likeData = doc.data();
            const count = likeData.count || 0;

            const likeButton = document.querySelector(
              `.like-btn[data-project="${projectId}"]`
            );
            if (likeButton) {
              const countElement = likeButton.querySelector(".like-count");
              if (countElement) {
                countElement.textContent = count;
              }
            }
          });
        } catch (error) {
          console.error("Error fetching likes:", error);
        }
      }

      // Update like button click event to use Firebase
      document.querySelectorAll(".like-btn").forEach((button) => {
        button.addEventListener("click", async function () {
          const projectId = this.getAttribute("data-project");
          const likeKey = `project-${projectId}-liked`;

          // Prevent double-clicking by checking localStorage
          if (localStorage.getItem(likeKey) === "true") {
            alert("You have already liked this project.");
            return;
          }

          try {
            // Get a reference to the specific project's like document
            const projectRef = db.collection("projectLikes").doc(projectId);

            // Use a transaction to safely increment the count in the database
            await db.runTransaction(async (transaction) => {
              const doc = await transaction.get(projectRef);

              if (!doc.exists) {
                // If the document doesn't exist, create it with a count of 1
                transaction.set(projectRef, { count: 1 });
              } else {
                // If it exists, increment the count
                const newCount = doc.data().count + 1;
                transaction.update(projectRef, { count: newCount });
              }
            });

            // Update the UI after the database update is successful
            const countElement = this.querySelector(".like-count");
            countElement.textContent = parseInt(countElement.textContent) + 1;

            // Save state to local storage to prevent liking more than once
            localStorage.setItem(likeKey, "true");

            // Update the heart icon
            const heartIcon = this.querySelector("i");
            this.classList.add("liked");
            heartIcon.classList.remove("far");
            heartIcon.classList.add("fas");
          } catch (error) {
            console.error("Transaction failed:", error);
            alert("An error occurred while liking the project. Please try again.");
          }
        });
      });

      // =================================================================
      // Comet and Stars Animation
      // =================================================================

      // Create shooting stars
      function createStars() {
        const sky = document.getElementById("sky");
        if (!sky) return; // Guard if element is missing
        const starCount = 80; // increase stars for richer background

        for (let i = 0; i < starCount; i++) {
          const star = document.createElement("div");
          star.classList.add("star");

          // Random properties for each star
          const size = Math.random() * 3 + 1;
          const posX = Math.random() * 100;
          const delay = -Math.random() * 6; // negative delay so animation is visible immediately
          const duration = Math.random() * 3 + 3; // faster overall speed (3-6s)

          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.left = `${posX}%`;
          star.style.top = `${Math.random() * 20 - 20}%`; // start slightly above viewport
          star.style.animationDelay = `${delay}s`;
          star.style.animationDuration = `${duration}s`;

          sky.appendChild(star);
        }
      }

      // Create comet
      function createComet() {
        const comet = document.getElementById("comet");
        const delay = Math.random() * 20;
        comet.style.animationDelay = `-${delay}s`;
      }

      // Page navigation
      function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll(".page").forEach((page) => {
          page.classList.remove("active");
        });

        // Show the selected page
        document.getElementById(pageId).classList.add("active");

        // Scroll to top
        window.scrollTo(0, 0);
      }

      // All code that needs to run after the DOM is fully loaded should be inside this listener
      document.addEventListener("DOMContentLoaded", function () {
        // Generic function to handle Formspree submissions
        function handleFormspreeSubmission(formId, successMessage) {
          const form = document.getElementById(formId);
          if (!form) return;

          form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formUrl = this.action;

            fetch(formUrl, {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
              },
            })
              .then((response) => {
                if (response.ok) {
                  alert(successMessage);
                  form.reset();
                  if (formId === "suggestionForm") {
                    document
                      .getElementById("suggestionModal")
                      .classList.remove("active");
                  }
                } else {
                  response.json().then((data) => {
                    if (Object.hasOwnProperty.call(data, "errors")) {
                      alert(
                        data["errors"].map((error) => error["message"]).join(", ")
                      );
                    } else {
                      alert("Oops! There was a problem submitting your form.");
                    }
                  });
                }
              })
              .catch((error) => {
                alert("Oops! There was a problem submitting your form.");
              });
          });
        }

        // Initialize Formspree submissions
        handleFormspreeSubmission("suggestionForm", "Thank you for your suggestion!");
        handleFormspreeSubmission("contactForm", "Thank you for your message!");

        // Suggestion modal functionality
        const suggestionModal = document.getElementById("suggestionModal");
        const projectIdInput = document.getElementById("projectId");
        const closeBtn = document.querySelector(".close-modal");

        if (suggestionModal && projectIdInput && closeBtn) {
          document.querySelectorAll(".suggestion-btn").forEach((button) => {
            button.addEventListener("click", function () {
              const projectId = this.getAttribute("data-project") || "";
              projectIdInput.value = projectId;
              suggestionModal.classList.add("active");
            });
          });

          closeBtn.addEventListener("click", function () {
            suggestionModal.classList.remove("active");
          });
        }

        // Initialize when page loads
        createStars();
        createComet();
        fetchAndDisplayTestimonials();
        fetchAndDisplayLikes();

        // This part is crucial: Check for existing likes in local storage
        document.querySelectorAll(".like-btn").forEach((button) => {
          const projectId = button.getAttribute("data-project");
          const likeKey = `project-${projectId}-liked`;
          if (localStorage.getItem(likeKey) === "true") {
            button.classList.add("liked");
            const heartIcon = button.querySelector("i");
            heartIcon.classList.remove("far");
            heartIcon.classList.add("fas");
          }
        });
      });

      // Close modal when clicking outside
      window.addEventListener("click", function (e) {
        const modal = document.getElementById("suggestionModal");
        if (modal && e.target === modal) {
          modal.classList.remove("active");
        }
      });