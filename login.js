//載入vue
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = createApp({
	data() {
		return {
			//建立登入用資料，用v-model與html頁面雙向綁定
			user: {
				username: "",
				password: "",
			},
		};
	},

	methods: {
		login() {
			const url = "https://vue3-course-api.hexschool.io/v2/admin/signin";
			//用post方法，實作登入功能
			axios
				.post(url, this.user)
				.then((res) => {
					// console.log(res);
					const token = res.data.token; //取出token
					const expired = res.data.expired; //取出expired(有效時間)
					//將token和expired放入cookie
					document.cookie = `hexToken=${token};expires=${new Date(
						expired
					)}; path=/`;
					//登入成功後導向proeucts頁面
					location.href = "adminProducts.html";
				})
				.catch((err) => {
					alert(err.data.error.message);
				});
		},
		//自動帶入帳號密碼，方便助教使用
		autoLoad(){
			this.user.username = "senby298@gmail.com";
			this.user.password = "24730022";
		}
	},
});

app.mount("#app");
