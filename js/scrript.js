document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParrent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((tab) => {
      tab.classList.add("hide");
      tab.classList.remove("show", "fade");
    });

    tabs.forEach((tab) => {
      tab.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }
  hideTabContent();
  showTabContent();
  tabsParrent.addEventListener("click", (event) => {
    if (event.target != event.currentTarget) {
      tabs.forEach((tab, i) => {
        if (tab == event.target) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
  const deadline = "2024-06-20";

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endtime) - new Date();

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((total / (1000 * 60)) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }
  function addZero(str) {
    return String(str).padStart(2, "0");
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timerId = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const total = getTimeRemaining(endtime);
      days.textContent = addZero(total.days);
      hours.textContent = addZero(total.hours);
      minutes.textContent = addZero(total.minutes);
      seconds.textContent = addZero(total.seconds);
      if (total.total <= 0) {
        clearInterval(timerId);
      }
    }
  }
  setClock(".timer", deadline);

  const modalBtns = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalClose = document.querySelector("[data-close]");

  function showModal() {
    modal.classList.add("show", "fade");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }
  modalBtns.forEach((btn) => {
    btn.addEventListener("click", showModal);
  });

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show", "fade");
    document.body.style.overflow = "unset";
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target === modalClose) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
  const modalTimerId = setTimeout(showModal, 5000);

  function showModalByScroll() {
    if (
      window.scrollY + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      showModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  class MenuCard {
    constructor(src, alt, title, descr, price, parrentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parrent = document.querySelector(parrentSelector);
      this.transfer = 40;
      this.changeToUAH();
    }
    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement("div");
      element.innerHTML = `
      <div class="menu__item">
            <img src=${this.src} alt=${this.alt} />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
              ${this.descr}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Price:</div>
              <div class="menu__item-total"><span>${this.price}</span> UAH/day</div>
            </div>
          </div>
      `;
      this.parrent.append(element);
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    '"Fitness" Menu',
    'The "Fitness" menu is a new approach to cooking: more fresh vegetables and fruits. A product for active and healthy people. It is an entirely new product with an optimal price and high quality!',
    7,
    ".menu .container"
  ).render();
  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    '"Premium" Menu',
    'In the "Premium" menu, we use not only beautiful packaging design but also quality execution of dishes. Red fish, seafood, fruits - a restaurant menu without going to the restaurant!',
    10,
    ".menu .container"
  ).render();
  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    '"Lenten" Menu',
    ' The "Lenten" menu is a careful selection of ingredients: complete absence of animal products, milk from almonds, oats, coconut, or buckwheat, the right amount of protein due to tofu.',
    9,
    ".menu .container"
  ).render();

  const forms = document.querySelectorAll("form");

  const messages = {
    loading: "loading",
    failure: "Oops...",
    success: "We will get back to you as soon as possible.",
  };

  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      statusMessage.textContent = messages.loading;
      form.append(statusMessage);

      const request = new XMLHttpRequest();
      request.open("POST", "server.php");

      request.setRequestHeader(
        "Content-type",
        "application/json; charset=utf-8"
      );
      const formData = new FormData(form);

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      const json = JSON.stringify(object);

      request.send(json);

      request.addEventListener("load", () => {
        if (request.status === 200) {
          console.log(request.response);
          statusMessage.textContent = messages.success;
          form.reset();
          setTimeout(() => {
            statusMessage.remove();
          }, 2000);
        } else {
          statusMessage.textContent = messages.failure;
        }
      });
    });
  }
  postData(forms[0]);
});
