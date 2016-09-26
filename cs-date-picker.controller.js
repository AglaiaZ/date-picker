/**
 * @author zhangboxuan@thinkerx.com
 */
angular
.module('seller')
.controller('DatePickerCtrl', DatePickerCtrl);

DatePickerCtrl.$inject = ['$scope', 'DATE_PICKER_TYPE'];

function DatePickerCtrl($scope, DATE_PICKER_TYPE) {
    var vm = this;
    var delta = 0;
    var datePickerType = DATE_PICKER_TYPE.TYPE_DATE_RANGE;
    var endDate, startDate, date;

    vm.nowDate = new Date();
    vm.dateRange = {
        'startDate': null,
        'endDate': null
    };

    vm.prev = prev;
    vm.next = next;
    vm.selectDateRange = selectDateRange;


    init();

    function init() {
        selectDateRange(5, new Date('2016-02-01'), new Date());
        // query();
    }

    // 获取上一个月
    function getPrevMonth(date) {
        var year = date.getFullYear(); 
        var month = date.getMonth()+1; 
        var day = date.getDate(); 
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 === 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    }

    // 获取下一个月
    function getNextMonth(date) {
        var year = date.getFullYear(); 
        var month = date.getMonth()+1; 
        var day = date.getDate(); 
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 === 13) {
            year2 = parseInt(year2) + 1;
            month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
    
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    }

    /**
     * 往前一天 / 一段时间
     */
    function prev() {
        switch (datePickerType) {
            case DATE_PICKER_TYPE.TYPE_TODAY:
            case DATE_PICKER_TYPE.TYPE_DATE:
                delta = 1000 * 60 * 60 * 24;
                var date = new Date(new Date(vm.dateRange.startDate).getTime() - delta);
                setDateRangeDate(date);
                break;
            case DATE_PICKER_TYPE.TYPE_7_DAYS_AGO:
                delta = 1000 * 60 * 60 * 24 * 7;
                var endDate = new Date(new Date(vm.dateRange.endDate).getTime() - delta);
                setDateRangeNDaysAgo(7, endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_30_DAYS_AGO:
                delta = 1000 * 60 * 60 * 24 * 30;
                endDate = new Date(new Date(vm.dateRange.endDate).getTime() - delta);
                setDateRangeNDaysAgo(30, endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_DATE_RANGE:
                var deltaDays = Math.floor((vm.dateRange.endDate - vm.dateRange.startDate) / (1000 * 60 * 60 * 24)); //计算时间差
                setDateRangeNDaysAgo(deltaDays, vm.dateRange.startDate);
                break;
            case DATE_PICKER_TYPE.TYPE_LAST_MONTH:
                var prevMonth = new Date(getPrevMonth(vm.dateRange.endDate));
                days = new Date(prevMonth.getFullYear(), prevMonth.getMonth()+1, 0).getDate()-1;
                date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), days+1);
                setDateRangeNDaysAgo(days, date);
                break;
        }

        query();
    }

    /**
     * 往后一天 / 一段时间
     */
    function next() {
        switch (datePickerType) {
            case DATE_PICKER_TYPE.TYPE_TODAY:
            case DATE_PICKER_TYPE.TYPE_DATE:
                delta = 1000 * 60 * 60 * 24;
                var date = new Date(new Date(vm.dateRange.startDate).getTime() + delta);
                setDateRangeDate(date);
                break;
            case DATE_PICKER_TYPE.TYPE_7_DAYS_AGO:
                delta = 1000 * 60 * 60 * 24 * 7;
                var endDate = new Date(new Date(vm.dateRange.endDate).getTime() + delta);
                setDateRangeNDaysAgo(7, endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_30_DAYS_AGO:
                delta = 1000 * 60 * 60 * 24 * 30;
                endDate = new Date(new Date(vm.dateRange.endDate).getTime() + delta);
                setDateRangeNDaysAgo(30, endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_DATE_RANGE:
                var deltaDays = Math.floor((vm.dateRange.endDate - vm.dateRange.startDate) / (1000 * 60 * 60 * 24)); //计算时间差
                endDate = new Date(new Date(vm.dateRange.endDate).getTime() + 1000 * 60 * 60 * 24 * deltaDays);
                setDateRangeNDaysAgo(deltaDays, endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_LAST_MONTH:
                var nextMonth = new Date(getNextMonth(vm.dateRange.endDate));
                var days = new Date(nextMonth.getFullYear(), nextMonth.getMonth()+1, 0).getDate()-1;
                date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), days+1);
                setDateRangeNDaysAgo(days, date);
                break;
        }

        query();
    }

    /**
     * 把时间段设置为N天前
     * 
     * @param int days 几天前
     * @param Date date 某一天
     */
    function setDateRangeNDaysAgo(days, date) {
        delta = 1000 * 60 * 60 * 24 * days;
        if (date) {
            vm.dateRange.endDate = date;
        }
        vm.dateRange.startDate = new Date(vm.dateRange.endDate - delta);
    }

    /**
     * 把时间段设置为某一天
     */
    function setDateRangeDate(date) {
        vm.dateRange.startDate = date;
        vm.dateRange.endDate = date;
    }

    function selectDateRange(type, startDate, endDate) {
        datePickerType = type;

        switch (datePickerType) {
            case DATE_PICKER_TYPE.TYPE_TODAY:
                setDateRangeDate(new Date());
                break;
            case DATE_PICKER_TYPE.TYPE_7_DAYS_AGO:
                setDateRangeNDaysAgo(7, vm.nowDate);
                break;
            case DATE_PICKER_TYPE.TYPE_30_DAYS_AGO:
                setDateRangeNDaysAgo(30, vm.nowDate);
                break;
            case DATE_PICKER_TYPE.TYPE_DATE:
                setDateRangeDate(startDate);
                break;
            case DATE_PICKER_TYPE.TYPE_DATE_RANGE:
                vm.dateRange.startDate = startDate;
                vm.dateRange.endDate = endDate;
                var deltaDays = Math.floor((vm.dateRange.endDate - vm.dateRange.startDate) / (1000 * 60 * 60 * 24)); //计算时间差
                setDateRangeNDaysAgo(deltaDays, vm.dateRange.endDate);
                break;
            case DATE_PICKER_TYPE.TYPE_LAST_MONTH:
                var prevMonth = new Date(getPrevMonth(vm.dateRange.endDate));
                var days = new Date(prevMonth.getFullYear(), prevMonth.getMonth()+1, 0).getDate()-1;
                var date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), days+1);
                setDateRangeNDaysAgo(days, date);
                break;
        }

        query();
    }

    function query() {
        $scope.$emit('date_update_timely', vm.dateRange);
    }

}
