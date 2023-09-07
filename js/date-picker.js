(function (win) {
  class DatePicker{
    constructor(target, wrap, options = {}, callback) {
      if (!target) {
        return this.showError();
      }
      this.isInit = false;
      this.target = $(target);
      this.wrap = $(wrap) || $('.date-picker-wrap');
      this.options = options;
      this.tempPicker = 'picker';
      this.tempCalendar = 'calendar';
      this.selectEle = null;
      this.callback = callback || function (date) {
        this.target.val(date);
      };
      this.init();
    }
    eventAgent() {
      this.target.on('focus', (e) => {
        e.target.blur();
        if (this.isInit) {
          this.showPicker();
          return false;
        }
        this.initPickerView();
      });
      this.wrap.on('click', '.dp-container li', (e) => {
        let li = e.target;
        if ($(li).hasClass('disabled') || $(li).hasClass('empty')) {
          return false;
        }
        this.selectEle = $(li);
        this.confirm();
      })
    }
    init() {
      this.fixWrap();
      this.eventAgent();
    }
    resetConfirm() {
      $('.selected').removeClass('selected');
    }
    confirm() {
      this.resetConfirm();
      this.selectEle.addClass('selected');
      let date = this.selectEle[0].dataset['date'];
      this.callback(date);
      this.hidePicker();
    }
    addLastMonth() {
      this.current.transDate('-1m');
      this.prependToContainer(this.createMonthElement());
    }
    initPickerView() {
      this.isInit = true;
      this.today = new EasyDate();
      let options = this.options;
      this.start = options.start ? new EasyDate(options.start) : this.today;
      this.end = options.end ? new EasyDate(options.end) : null;
      this.current = this.today.clone();
      this.current.setDate(1);
      this.createPickerPage();     // 渲染整体picker
      this.appendToContainer(this.createMonthElement());
      this.current.transDate('+1m');
      this.appendToContainer(this.createMonthElement());
      this.current.transDate('-1m');
      this.showPicker();
    }
    /*
     *@method: createPickerPage
     *@description: 渲染picker插件页面
    */
    createPickerPage() {
      let $pickHTML = $(this.getTemplate(this.tempPicker, {}));
      this.$container = $pickHTML.find('.dp-container');
      this.wrap.append($pickHTML);
    }
    /*
     *@method: appendToContainer
     *@description: 添加月blockHTML到container最后
    */
    appendToContainer(calendarHTML) {
      this.$container.append(calendarHTML);
    }
    /*
     *@method: appendToContainer
     *@description: 添加月blockHTML到container最前
    */
    prependToContainer(calendarHTML) {
      this.$container.prepend(calendarHTML);
    }
    /*
     *@method: showPick
     *@description: picker组件页面划入
    */
    showPicker() {
      this.wrap.addClass('show');
      let that = this;
      this.PullDown = new PullDown({
        contentEle: this.$container,
        callback(cb) {
          that.addLastMonth()
          cb();
        }
      });
    }
    /*
     *@method: showPick
     *@description: picker组件页面划出
    */
    hidePicker() {
      this.wrap.removeClass('show');
    }
    /*
     *@method: createMonthObject
     *@description: 获取当前月的数据对象
     *@param: {Object Date} current
     *@param: {Object Date} today
     *@param: {Object Date} start
     *@param: {Object Date} end
     *@return: {Object} 当前月对象
    */
    createMonthObject(current, today, start, end) {
      return current.toObject(today, start, end);
    }
    /*
     *@method: createMonthElement
     *@description: 创建月view组件
     *@param: {Object} option
    */
    createMonthElement() {
      // 获取当前月的渲染数据
      let month = this.createMonthObject(this.current, this.today, this.start, this.end);
      // 获取当前月的渲染内容
      let calendarHTML = this.getTemplate(this.tempCalendar, month);
      // 调用append 添加渲染内容到页面的dp-container内
      return calendarHTML;
    }
    /*
     *@method: getTemplate
     *@description: 根据模板和数据渲染对应的HTML内容
     *@param: {String} tempId 模板ID
     *@param: {Object} data 渲染数据
     *@return: {String: HTML} 渲染模板输出
    */
    getTemplate(tempId, data) {
      return template(tempId, data);
    }
    showError() {
      return "请传参设置目标input"
    }
    fixWrap() {
      let $wrap = $(this.wrap);
      let isWrap = $wrap.hasClass('date-picker-wrap');
      isWrap || $wrap.addClass('date-picker-wrap');
    }
  }
  win.DatePicker = DatePicker;
})(window);