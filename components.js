
//產品頁元件
const showProducts = {
    props:["products","showEditModal","deleteProductModal"],
    template:`  
        <table class="table mt-4">
          <thead>
            <tr>
              <th width="120">
                分類
              </th>
              <th>產品名稱</th>
              <th width="120">
                原價
              </th>
              <th width="120">
                售價
              </th>
              <th width="100">
                是否啟用
              </th>
              <th width="120">
                編輯
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td>{{item.category}}</td>
              <td>{{item.title}}</td>
              <td >{{item.origin_price}}</td>
              <td >{{item.price}}</td>
              <td>
                <span class="text-success">{{item.is_enabled? "啟用" : "未啟用"}}</span>
                
              </td>
              <td>
                <div class="btn-group">
                   
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="showEditModal(item.id)">
                    編輯
                  </button>
                    
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteProductModal(item.id)">
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
    `,
}
//modal元件
const modal = {
    props:["formData","hideModal","createProduct","editProduct","validation"],
    template:`
        <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 id="productModalLabel" class="modal-title">
                <!-- 若formData沒有id為新增功能，若formData有id為修改功能 -->
                <span> {{!formData.id ? "新增產品" : "修改產品"}} </span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-4">
                  <div class="mb-2">
                    <div class="mb-3">
                      <label for="imageUrl" class="form-label">輸入圖片網址</label>
                      <input type="text" class="form-control"
                             placeholder="請輸入圖片連結" v-model="formData.imageUrl">
                    </div>
                    <img class="img-fluid" :src="img" alt="" v-for="img in formData.imagesUrl" key="img">
                  </div>
                  <div>
                    <button class="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button class="btn btn-outline-danger btn-sm d-block w-100">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <!-- 表單input用v-model雙向綁定formData -->
                <div class="col-sm-8">
                  <div class="mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="formData.title" required>
                  </div>

                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label for="category" class="form-label">分類</label>
                      <input id="category" type="text" class="form-control"
                             placeholder="請輸入分類" v-model="formData.category" required>
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="price" class="form-label">單位</label>
                      <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="formData.unit" required>
                    </div>
                  </div>

                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label for="origin_price" class="form-label">原價</label>
                      <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model="formData.origin_price">
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="price" class="form-label">售價</label>
                      <input id="price" type="number" min="0" class="form-control"
                             placeholder="請輸入售價" v-model="formData.price">
                    </div>
                  </div>
                  <hr>

                  <div class="mb-3">
                    <label for="description" class="form-label">產品描述</label>
                    <textarea id="description" type="text" class="form-control"
                              placeholder="請輸入產品描述" v-model="formData.description">
                    </textarea>
                  </div>
                  <div class="mb-3">
                    <label for="content" class="form-label">說明內容</label>
                    <textarea id="description" type="text" class="form-control"
                              placeholder="請輸入說明內容" v-model="formData.content">
                    </textarea>
                  </div>
                  <div class="mb-3">
                    <div class="form-check">
                      <input id="is_enabled" class="form-check-input" type="checkbox"
                             :true-value="1" :false-value="0" v-model="formData.is_enabled">
                      <label class="form-check-label" for="is_enabled">是否啟用</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="hideModal">
                取消
              </button>
              <!-- 如果formData沒有id，代表是新增功能。 -->
              <button type="button" class="btn btn-primary" @click="createProduct" v-if="!formData.id">
                確認
              </button>
              <!-- 如果formData有id，代表是編輯功能、順便把id綁上 -->
              <button type="button" class="btn btn-success" @click="editProduct(formData.id)" v-else >
                修改
              </button>
            </div>
          </div>
        </div>
      </div>
    `
};

//確認刪除modal元件
const delModal = {
    props:["deleteProduct"],
    template:`
        <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
           aria-labelledby="delProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
              <h5 id="delProductModalLabel" class="modal-title">
                <span>刪除產品</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              是否刪除
              <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
              </button>
              <button type="button" class="btn btn-danger" @click="deleteProduct">
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    `
};

//pagination元件
const pagination ={
    props:["pagination","changePage"],
    template:`
        <nav aria-label="..." class="mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{'disabled' : pagination.current_page === 1}">
              <span class="page-link" v-if="pagination.current_page === 1">Previous</span>
              <a href="#" class="page-link" v-else @click.prevent="changePage(pagination.current_page - 1)">Previous</a>              
            </li>

            <li class="page-item" v-for="(item,index) in pagination.total_pages" :class="{'active':item === pagination.current_page}">
              <span class="page-link" v-if="item === pagination.current_page" >{{item}}</span>
              <a class="page-link" href="#" v-else @click.prevent="changePage(item)">{{item}}</a>
            </li>

            <li class="page-item" :class="{'disabled' : pagination.current_page === pagination.total_pages}">
              <span class="page-link" v-if="pagination.current_page === pagination.total_pages">Next</span>
              <a class="page-link" href="#" v-else @click.prevent="changePage(pagination.current_page + 1)">Next</a>
              
            </li>

          </ul>
        </nav>
    `,
};

export {showProducts, modal, delModal, pagination};