const {createApp} = Vue;

const apiUrl = "https://vue3-course-api.hexschool.io";
const api_path = "xianbei";
const url = `${apiUrl}/v2/api/${api_path}/admin/products`;
  
import {showProducts, modal, delModal, pagination} from "./components.js";

//bootstrap Model功能，用vue的JS來處理
let formModal;
let deleteModal;
let deleteId;

const app = createApp({
    data(){
        return{
            //所有產品資料，用來放從後端抓到的所有產品資料
            products:[],
            //用來暫存form內的資料
            formData:{
                category: "",
                content: "",
                description: "",
                // id: "", 新增不需id，修改已有id，故不需要id這項
                is_enabled: 0,
                origin_price: 0,
                price: 0,
                title: "",
                unit: "",
                num: 1,
                imageUrl: "",
                imagesUrl: [],
            },
            pagination:{},
        }
    },
    
    methods:{
        //取得所有產品
        getProducts(){
            axios.get(url)
                .then((res)=>{
                    this.products = res.data.products
                    this.pagination = res.data.pagination
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        //驗證新增和修改表單內容，只做輸入空白檢查
        validation(){
            //驗證填寫內容
            let tempArr=[];
            if(this.formData.title.trim().length === 0){
                tempArr.push("標題必填")
            }
            if(this.formData.category.trim().length === 0){
                tempArr.push("分類必填")
            }
            if(this.formData.unit.trim().length === 0){
                tempArr.push("單位必填")
            }
            if(this.formData.origin_price.length === 0){
                tempArr.push("原價必填")
            }
            if(this.formData.price.length === 0){
                tempArr.push("售價必填")
            }
            if(this.formData.description.trim().length === 0){
                tempArr.push("產品描述必填")
            }
            if(this.formData.content.trim().length === 0){
                tempArr.push("說明內容必填")
            }
            //回報驗證結果
            if (tempArr.length === 0){
                return true;
            }else {
                alert(tempArr)
            }
        },
        //清空表單內容
        cleanForm(){
            this.formData = {
                category: "",
                content: "",
                description: "",
                is_enabled: 0,
                origin_price: 0,
                price: 0,
                title: "",
                unit: "",
                num: 1,
                imageUrl: "",
                imagesUrl: [],
            }
        },
        //開啟建立新產品表單
        showCreateModal(){
            //先清空表單內容，再開啟model
            this.cleanForm();
            this.showModal();
        },
        //create功能
        createProduct(){
            //create api url
            const createUrl = `${apiUrl}/v2/api/${api_path}/admin/product`;
            //create 資料內容
            const data = {data:this.formData}
            //驗證表單內容，沒問題再送出新增
            if(this.validation()){
                axios.post(createUrl,data)
                    .then((res)=>{
                        this.hideModal();
                        this.getProducts();
                    })
                    .catch((err)=>{
                        console.error(err)
                    });               
            }else{ 
                //驗證不通過則中斷新增功能
                return
            }                      
        },
        //顯示編輯表單內容
        showEditModal(id){
            //找出id在products中的位置，再將資料放入formData中，然後開啟model。
            const index = this.products.findIndex((item)=>{                
                return item.id == id
            })
            this.formData = this.products[index]
            this.showModal();           
        },
        //編輯表單功能
        editProduct(id){
            //put api url
            const editUrl = `${apiUrl}/v2/api/${api_path}/admin/product/${id}`;
            const data = {data:this.formData}
            //驗證表單通過後再送出編輯
            if(this.validation()){
                axios.put(editUrl,data)
                    .then((res)=>{
                        this.changePage(this.pagination.current_page);
                        this.hideModal();
                    })
                    .catch((err)=>{
                        console.error(err)
                    });               
            }else{ 
                return
            }
        },
        //刪除功能，從刪除確認modal中抓取id，在把id帶入刪除api路徑中
        deleteProductModal(id){
            deleteId = id;
            deleteModal.show()
        },
        //刪除功能
        deleteProduct(){
            //delete api url
            const deleteUrl = `${apiUrl}/v2/api/${api_path}/admin/product/${deleteId}`;
            axios.delete(deleteUrl)
                .then((res)=>{
                    this.changePage(this.pagination.current_page);
                    deleteModal.hide()                    
                })
                .catch((err)=>{
                    console.log(err)
                })
        },

        //bootstrap Model功能
        showModal(){
            formModal.show();
        },
        hideModal(){
            formModal.hide();
        },

        //Pagination功能
        changePage(page){
            const pageUrl = `${url}?page=${page}`;
            axios.get(pageUrl)
                .then((res)=>{
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch((err)=>{
                    console.log(err.message)
                })
        }
    },

    mounted(){
        //取出token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //將token放入axios的header中
        axios.defaults.headers.common.Authorization = token;

        //建立bootstrap的model來控制model的開啟關閉。
        const productModal = document.querySelector("#productModal");
        formModal = new bootstrap.Modal(productModal);
        const deleteConfirmModal = document.querySelector("#delProductModal")
        deleteModal = new bootstrap.Modal(deleteConfirmModal);
        
        //抓取全部資料呈現在畫面上
        this.getProducts();
    },

    components:{
        showProducts,
        modal,
        delModal,
        pagination,
    },
});


app.mount("#app");