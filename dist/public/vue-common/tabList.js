Vue.component('TableList', {
  template: '#anchored-list-template',
  props: {
    arraydata: {
      type: Array,
    }
  },
  mounted: function() {
    console.log(this.arraydata)
  }
})

<Table-list v-bind:arraydata=templateData>

</Table-list>

<script type="text/x-template" id="anchored-list-template">
  <tbody>
    <tr v-for="(arrvalue, arrkey) in arraydata">
      <td v-for="(textvalue,textkey) in arrvalue.text">
        {{textvalue}}
      </td>
      <td>
        <a v-for="(buttonvalue,buttonkey) in arrvalue.button" href="javascript:void(0);" class="supplierrepay fl" data-id="21374">{{buttonvalue}}</a>
      </td>
    </tr>
  </tbody>
  
</script>


