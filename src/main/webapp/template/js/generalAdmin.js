// Other important pens.
// Map: https://codepen.io/themustafaomar/pen/ZEGJeZq
// Navbar: https://codepen.io/themustafaomar/pen/VKbQyZ

"use strict";

//Lay phan tu tuong ung
function $i(selector) {
	return document.querySelector(selector);
}

// Tim tat ca cac phan tu con cua noi dung
function find(el, selector) {
	let finded;
	return (finded = el.querySelector(selector)) ? finded : null;
}

// Tim cac phan tu anh em cua phan tu cu the e1
function siblings(el) {
	const siblings = [];
	for (let sibling of el.parentNode.children) {
		if (sibling !== el) {
			siblings.push(sibling);
		}
	}
	return siblings;
}

const showAsideBtn = $i(".show-side-btn");
const sidebar = $i(".sidebar");
const wrapper = $i("#wrapper");

showAsideBtn.addEventListener("click", function() {
	$i(`#${this.dataset.show}`).classList.toggle("show-sidebar");
	wrapper.classList.toggle("fullwidth");
});

// man hinh nho hon 767 sidebar mo rong
if (window.innerWidth < 767) {
	sidebar.classList.add("show-sidebar");
}

//nếu lớn hơn 767px, sidebar sẽ tự động đóng lại.
window.addEventListener("resize", function() {
	if (window.innerWidth > 767) {
		sidebar.classList.remove("show-sidebar");
	}
});

// dropdown menu in the side nav
var slideNavDropdown = $i(".sidebar-dropdown");

$i(".sidebar .categories").addEventListener("click", function(event) {
	//        event.preventDefault()
	// ngăn chặn tag a chuyển hướng
	//Kiểm tra xem phần tử được nhấn có phải là một thẻ <a> hay không.
	const isMenuLink =
		event.target.tagName === "A"
			? !!event.target.classList.contains("side-menu-header")
			: true; //Kiểm tra xem nó có lớp side-menu-header

	// để tìm phần tử cha gần nhất có lớp has-dropdown
	const item = event.target.closest(".has-dropdown");

	//không tìm thấy mục có lớp has-dropdown, hàm sẽ dừng lại
	if (!item) {
		return;
	}
	//Chuyển hướng nếu không phải là liên kết menu
	if (!isMenuLink) {
		//window.open(event.target.getAttribute('href'), '_blank').focus();
		return (window.location = event.target.getAttribute("href"));
	}

	//Mở hoặc đóng dropdown
	item.classList.toggle("opened");

	//Đóng các dropdown khác
	siblings(item).forEach((sibling) => {
		sibling.classList.remove("opened");
	});

	//Nếu mục có lớp opened, tìm phần tử con có lớp sidebar-dropdown và thêm lớp active để hiển thị dropdown.
	if (item.classList.contains("opened")) {
		const toOpen = find(item, ".sidebar-dropdown");

		if (toOpen) {
			toOpen.classList.add("active");
		}

		//Nếu không mở (khi nhấn vào liên kết menu), nó sẽ xóa lớp active khỏi các dropdown khác.
		siblings(item).forEach((sibling) => {
			const toClose = find(sibling, ".sidebar-dropdown");

			if (toClose) {
				toClose.classList.remove("active");
			}
		});
	} else if (isMenuLink) {
		find(item, ".sidebar-dropdown").classList.toggle("active");
	}
});

//Đóng sidebar khi nhấn nút đóng
$i(".sidebar .close-aside").addEventListener("click", function() {
	$i(`#${this.dataset.close}`).classList.add("show-sidebar");
	wrapper.classList.remove("margin");
});