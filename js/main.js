window.addEventListener("hashchange", navigatorController, false);
window.addEventListener("DOMContentLoaded", navigatorController, false);
document.addEventListener("load", navigatorController, false);
welcomeForm.addEventListener("submit", welcomeFormSubmit);

MONEY_FORMATTER = new Intl.NumberFormat("es-mx", {
	style: "currency",
	currency: "MXN",
});

function navigatorController() {
	const hash = window.location.hash;
	const userData = JSON.parse(localStorage.getItem("xmasLuis"));

	if (!userData) {
		console.log("no user data");
		welcomeMain.classList.remove("d-none");
		mainPage.classList.add("d-none");
		viewPage.classList.add("d-none");
		return;
	}

	if (hash.includes("view")) {
		viewPage.classList.remove("d-none");
		mainPage.classList.add("d-none");
		welcomeMain.classList.add("d-none");

		const giftID = hash.split("=")[1];
		console.log(giftID);
		manageViewPage(giftID);
		markLinkAsClicked(giftID);
	} else {
		manageMainPage();
		mainPage.classList.remove("d-none");
		viewPage.classList.add("d-none");
		welcomeMain.classList.add("d-none");
	}
}

function saveUserData(data) {
	localStorage.setItem("xmasLuis", JSON.stringify(data));
}

function welcomeFormSubmit(event) {
	event.preventDefault();

	const name = nameInput.value;
	const genre = genreInput.value;

	const userData = {
		name,
		genre,
	};

	saveUserData(userData);

	const clickedLinks = {};
	Object.keys(GIFT_INFORMATION).forEach((key) => {
		clickedLinks[key] = false;
	});

	localStorage.setItem("clickedLinks", JSON.stringify(clickedLinks));

	navigatorController();
	manageMainPage();
}

function manageMainPage() {
	const greetings = {
		el: "Bienvenido",
		ella: "Bienvenida",
		elle: "Bienvenide",
		ellx: "Bienvenidx",
	};
	const userData = JSON.parse(localStorage.getItem("xmasLuis"));
	const { name, genre } = userData;

	welcomeMessage.textContent = `${greetings[genre]} ${name}`;
	checkClickedLinks();
}

function manageViewPage(giftID) {
	loaderContainer.classList.remove("d-none");
	contentContainer.classList.add("d-none");
	const gift = GIFT_INFORMATION[giftID];
	const { name, description, price, image, link, otherPlaces } = gift;

	nameGift.textContent = name;
	descriptionGift.textContent = description;
	priceGift.textContent = MONEY_FORMATTER.format(price || 0);
	linkGift.href = link;
	photoGift.src = image;
	photoGift.alt = name;
	fillOtherPlaces(otherPlaces);

	setTimeout(() => {
		loaderContainer.classList.add("d-none");
		contentContainer.classList.remove("d-none");
	}, 1000);
}

function checkClickedLinks() {
	const clickedLinks = JSON.parse(localStorage.getItem("clickedLinks"));

	const giftKeys = Object.keys(GIFT_INFORMATION);

	// Verificar y actualizar clickedLinks
	giftKeys.forEach((giftID) => {
		if (!(giftID in clickedLinks)) {
			clickedLinks[giftID] = false; // Añadir el giftID si no está en clickedLinks
		}
	});

	// Guardar los clickedLinks actualizados en localStorage
	localStorage.setItem("clickedLinks", JSON.stringify(clickedLinks));

	giftsContainer.innerHTML = "";

	Object.entries(clickedLinks).forEach(([giftID, value]) => {
		const giftNode = createGiftNodes(giftID, value);
		giftsContainer.appendChild(giftNode);
	});
}

function markLinkAsClicked(giftID) {
	const clickedLinks = JSON.parse(localStorage.getItem("clickedLinks"));
	clickedLinks[giftID] = true;

	localStorage.setItem("clickedLinks", JSON.stringify(clickedLinks));

	console.log("clickedLinks", clickedLinks);

	manageMainPage();
}

function createGiftNodes(giftID, value) {
	const anchor = document.createElement("a");
	anchor.href = `#view=${giftID}`;
	if (!value) {
		const span = document.createElement("span");
		span.classList.add("material-symbols-outlined", "gift-icon");
		span.textContent = "featured_seasonal_and_gifts";
		anchor.appendChild(span);
	} else {
		const giftInfo = GIFT_INFORMATION[giftID];
		console.log("giftID", giftID);
		console.log("giftInfo", giftInfo);

		const { name, image } = giftInfo;

		const img = document.createElement("img");
		img.src = image;
		img.alt = name;
		anchor.appendChild(img);

		const p = document.createElement("p");
		p.textContent = name;
		anchor.appendChild(p);
	}

	return anchor;
}

function fillOtherPlaces(otherPlaces) {
	const ulNode = otherPlace.querySelector("ul");
	ulNode.innerHTML = "";
	(otherPlaces || []).forEach((place) => {
		const li = document.createElement("li");
		li.textContent = place;
		ulNode.appendChild(li);
	});
}
