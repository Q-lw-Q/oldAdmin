var template = `
<section class="sidebar" id="sidebar">
    <ul class="sidebar-menu">
        <li class="bgfff">
            <a href="/checkstand" class="sidleabtn" sv_func_id="8334">
                <i class="iconfont icon-nav i1 el-icon-s-finance" style="font-size: 26px;"></i>
                <span class="nav-title">前台收银</span>
            </a>
        </li>
        <li class="bgfff">
            <a href="/admin/home" class="sidleabtn" sv_func_id="4532">
                <i class="iconfont icon-nav i1"></i>
                <span class="nav-title">店铺概况</span>
            </a>
        </li>
        <li>
            <a href="javascript:void(0);" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">订单管理</span>
            </a>
            <ul class="two-menu helodao">
                <li><a href="/admin/orderManagement">订单查询</a></li>
                <li><a href="/admin/exceptionOrder">异常订单处理</a></li>
            </ul>
        </li>
            <li class="">
                <a href="javascript:void(0);" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">售卖管理</span>
            </a>
            <ul class="two-menu helodao">
                <li><a href="/admin/shopping">添加商品</a></li>
                <li><a href="/admin/shoppingprice">价格管理</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:void(0);" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">商品管理</span>
            </a>
            <ul class="two-menu helodao">
            <li><a href="/admin/inventoryList" sv_func_id="4530">库存列表</a></li>
            <li><a href="/admin/shopErrorList" sv_func_id="4530">错误商品列表</a></li>
            <li><a href="/admin/adressList">库存位置列表</a></li>
            <li><a href="/admin/goodsStock/">补货列表</a></li>
            </ul>
            <i class="caretactive"></i>
        </li>
        <li>
            <a href="javascirpt:void(0);" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">广告管理</span>
            </a>
            <ul class="two-menu helodao">
            <li><a href="/admin/advertisement" sv_func_id="4530">轮播管理</a></li>
            <li><a href="/admin/advertisementbaa" sv_func_id="4530">广告管理</a></li>
            </ul>
        </li>
        <li class="bgfff">
            <a href="javascript:void(0);" class="sidleabtn" sv_func_id="7071">
                <i class="iconfont icon-nav i1"></i>
                <span class="nav-title">用户管理</span>
            </a>
            <ul class="two-menu helodao">
                <li><a href="/admin/userManagement" sv_func_id="4530">用户列表</a></li>
                <li><a href="/admin/records/">交接班记录</a></li>
                <li><a href="/admin/rtctoken">用户认证</a></li>
            </ul>
            <i class="caretactive"></i>
        </li>
        <li class="bgfff">
            <a href="/admin/abnormalList" class="sidleabtn" sv_func_id="8334">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">报警列表</span>
            </a>
        </li>
    </ul>

</section>
`

{/* <li class="">
<a href="/admin/shopping" class="sidleabtn">
    <i class="iconfont icon-nav i2"></i>
    <span class="nav-title">商品信息</span>
</a>
</li> */}
{
    // 
}
let tplsadasdsaas = `
<li>
<a href="javascript:void(0);" class="sidleabtn">
    <i class="iconfont icon-nav i2"></i>
    <span class="nav-title">会员管理</span>
</a>
<ul class="two-menu helodao">
    <li><a href="/member/memberList_N3" sv_func_id="4441">新增会员</a></li>
    <li><a href="/member/memberList_N3" sv_func_id="4447">会员列表</a></li>
    <li><a href="/member/rechargeamount_N4" sv_func_id="9315">会员充值</a></li>
    <li><a href="/member/sfficienttime_N4" sv_func_id="9362">会员充次</a></li>
    <li><a href="/Integral/IntegralChange_N3" sv_func_id="4442">积分管理</a></li>

</ul>
<i class="caretactive"></i>

</li>
<li>
<a href="javascript:void(0);" class="sidleabtn">
    <i class="iconfont icon-nav i2"></i>
    <span class="nav-title">商品管理</span>
</a>
<ul class="two-menu helodao">
    <li><a href="/Product/Index_N3" sv_func_id="4506">新增商品</a></li>
    <li><a href="/Product/Index_N3?type=-1" sv_func_id="4484">商品列表</a></li>
    <li><a href="/ProductCategory/Index_N3" sv_func_id="4501">商品分类</a></li>

</ul>
<i class="caretactive"></i>

</li>

<li><a href="/repertory/Procurement_N3" sv_func_id="4508">采购管理</a></li>
<li><a href="/repertory/Batchnumber_N3" sv_func_id="9287">库存盘点</a></li>
<li><a href="/repertory/StockIntoOut_N3" sv_func_id="4529">库存调拨</a></li>
<li><a href="/InventoryBusiness/ProductModifyPrice_N3" sv_func_id="8304">库存业务</a></li>
<li><a href="/InventoryBusiness/ProductModifyPrice_N3" sv_func_id="8304">库存管理</a></li>

`

Vue.component("Leftcard", {
  template: template,
  methods: {

  },
  mounted: function() {
    $('#Leftcard .sidebar-menu li').hover(function() {
      $(this).addClass('active').siblings().removeClass('active')
      $(this).find('.caretactive').show()
      $(this).find('.helodao').show()

    }, function() {
      $(this).find('.caretactive').hide()
      $(this).find('.helodao').hide()
    })
  }
});