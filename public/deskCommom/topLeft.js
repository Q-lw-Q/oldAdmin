var template = `
<section class="sidebar" id="sidebar">
    <ul class="sidebar-menu">
        <li class="bgfff">
            <a href="/deskadmin/index" class="sidleabtn" sv_func_id="8334">
                <i class="iconfont icon-nav i1 el-icon-s-finance" style="font-size: 26px;"></i>
                <span class="nav-title">商品补货</span>
            </a>
        </li>
        <li>
            <a href="/deskadmin/stock" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">人工盘库</span>
            </a>
        </li>
        <li>
            <a href="javascript:void(0);" class="sidleabtn">
                <i class="iconfont icon-nav i2"></i>
                <span class="nav-title">补货列表</span>
            </a>
            <ul class="two-menu helodao">
                <li><a href="/deskadmin/soketDetail">库存详细</a></li>
                <li><a href="/deskadmin/deskDetail">补货明细</a></li>
            </ul>
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


