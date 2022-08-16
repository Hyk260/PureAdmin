import { IButtonMenu, IDomEditor } from '@wangeditor/editor'
import { Boot } from '@wangeditor/editor'       
import svg from '@/assets/icons/svg/link.svg';
let ABC = <svg t="1660616918132" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12890" width="32" height="32"><path d="M983.508514 312.661499a510.890241 510.890241 0 0 0-109.653242-162.730531 509.652909 509.652909 0 0 0-162.773198-109.653242A509.482242 509.482242 0 0 0 511.78624 0.000427c-69.119942 0-136.14922 13.567989-199.3385 40.234633a509.012909 509.012909 0 0 0-162.730531 109.695908A509.652909 509.652909 0 0 0 40.106633 312.661499 513.407572 513.407572 0 0 0 0 512c0 69.119942 13.567989 136.14922 40.234633 199.338501a509.012909 509.012909 0 0 0 109.695909 162.730531 509.652909 509.652909 0 0 0 162.730531 109.653242c63.146614 26.709311 130.133225 40.2773 199.3385 40.277299a510.890241 510.890241 0 0 0 362.069032-149.930541 509.652909 509.652909 0 0 0 109.653242-162.730531c26.709311-63.146614 40.2773-130.133225 40.2773-199.338501 0-69.205276-13.781322-136.14922-40.490633-199.338501zM511.871573 949.972968c-241.493132 0-437.972968-196.43717-437.972968-437.972968 0-241.493132 196.479836-437.972968 437.972968-437.972968S949.887208 270.464201 949.887208 512c0 241.493132-196.479836 437.972968-438.015635 437.972968z m243.455798-414.122321a36.821303 36.821303 0 0 0-36.47997 31.445307 209.237159 209.237159 0 0 1-206.719828 177.919852 209.578492 209.578492 0 0 1-206.975827-177.919852 36.906636 36.906636 0 1 0-72.959939 11.306657 280.831766 280.831766 0 0 0 79.701266 157.439869A281.087766 281.087766 0 0 0 511.999573 819.029077c75.60527 0 146.773211-29.439975 200.1065-82.901264a280.106433 280.106433 0 0 0 79.743934-157.482535 36.991969 36.991969 0 0 0-36.522636-42.751965z m-421.887649-102.058582a64.08528 64.08528 0 1 0 0-128.17056 64.08528 64.08528 0 0 0 0 128.17056z m357.119703 0a64.08528 64.08528 0 1 0 0.042666-128.17056 64.08528 64.08528 0 0 0 0 128.17056z" p-id="12891"></path></svg>
class YourMenuClass { 
    constructor() {
        this.title = '表情' // 自定义菜单标题
        this.iconSvg = svg// '<svg>...</svg>'可选
       
        
        this.tag = 'select' // button select
        this.width = 44
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor) { 
        return ' hello '
    }
    
    // 下拉框的选项
    getOptions(editor) { 
        const options = [
          { value: 'beijing', text: '北京' },
          { value: 'shanghai', text: '上海' },
          { value: 'shenzhen', text: '深圳' }
        ]
        return options
      }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) {  
      return false
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor) {   
      return false
    }

    // 点击菜单时触发的函数
    exec(editor, getValue) {                            
      if (this.isDisabled(editor)) return
      // editor.insertText(value) // value 即 this.value(editor) 的返回值
    }

}

const menu1Conf = {
  key: 'menu1', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new YourMenuClass() // 把 `YourMenuClass` 替换为你菜单的 class
  },
}
Boot.registerMenu(menu1Conf)
