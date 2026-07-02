/**
 * KitaABSENSI - Main Application Script
 * Dependencies: Alpine.js 3.x, Bootstrap 5.x
 * Compatible with: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
 */

// ─── AUTH FUNCTIONS ────────────────────────────────────────────────

function checkAuth() {
    var user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return JSON.parse(user);
}

function logout() {
    console.log('Logout dipanggil!');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────

function formatDate(dateStr) {
    var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var date = new Date(dateStr);
    return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

function addMinutes(timeStr, minutes) {
    var parts = timeStr.split(':').map(Number);
    var total = parts[0] * 60 + parts[1] + minutes;
    var newH = String(Math.floor(total / 60) % 24).padStart(2, '0');
    var newM = String(total % 60).padStart(2, '0');
    return newH + ':' + newM;
}

// ─── GENERATE HISTORY DINAMIS UNTUK SETIAP KARYAWAN ──────────────

function generateHistoryForEmployeeId(employeeId) {
    var history = [];
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // Periode 1: 20 Mei – 8 Juni, Shift Sore di Raja Kepiting (16:00 - 00:00)
    var start1 = new Date(2026, 4, 20);
    var end1 = new Date(2026, 5, 8);
    var current = new Date(start1);
    while (current <= end1) {
        var dateStr = current.toISOString().split('T')[0];
        var lateMin = Math.floor(Math.random() * 45);
        var status = 'on-time';
        if (lateMin > 15 && lateMin <= 30) status = 'late-5-15';
        else if (lateMin > 30) status = 'late-30-60';
        history.push({
            date: dateStr,
            date_formatted: formatDate(dateStr),
            shift: 'Sore',
            shift_start: '16:00',
            shift_end: '00:00',
            check_in: addMinutes('16:00', lateMin),
            check_out: addMinutes('00:00', lateMin),
            status: status
        });
        current.setDate(current.getDate() + 1);
    }

    // Periode 2: 10 Juni – hari ini, Shift Sore di My Fried Chicken (15:00 - 23:00)
    var start2 = new Date(2026, 5, 10);
    var end2 = new Date(today);
    current = new Date(start2);
    while (current <= end2) {
        var dateStr = current.toISOString().split('T')[0];
        // Variasi off day per karyawan
        var isOff = false;
        if (employeeId === 1 && dateStr === '2026-06-20') isOff = true;
        if (employeeId === 2 && (dateStr === '2026-06-15' || dateStr === '2026-06-22')) isOff = true;
        if (employeeId === 3 && dateStr === '2026-06-10') isOff = true;
        if (employeeId === 4 && dateStr === '2026-06-18') isOff = true;
        if (employeeId === 5 && dateStr === '2026-06-25') isOff = true;
        if (employeeId === 6 && dateStr === '2026-06-12') isOff = true;
        if (employeeId === 7 && dateStr === '2026-06-30') isOff = true;
        if (employeeId === 8 && dateStr === '2026-06-05') isOff = true;

        if (!isOff) {
            var lateMin = Math.floor(Math.random() * 45);
            var status = 'on-time';
            if (lateMin > 15 && lateMin <= 30) status = 'late-5-15';
            else if (lateMin > 30) status = 'late-30-60';
            history.push({
                date: dateStr,
                date_formatted: formatDate(dateStr),
                shift: 'Sore',
                shift_start: '15:00',
                shift_end: '23:00',
                check_in: addMinutes('15:00', lateMin),
                check_out: addMinutes('23:00', lateMin),
                status: status
            });
        }
        current.setDate(current.getDate() + 1);
    }

    history.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
    });
    return history;
}

// ─── DATA DUMMY DINAMIS ────────────────────────────────────────────

function getDummyEmployee() {
    var history = generateHistoryForEmployeeId(1);
    var lastLog = history.length > 0 ? history[history.length - 1] : null;
    return {
        id: 1,
        nama: 'Deuwi Satriya Irawan',
        outlet_id: 1,
        shift_id: 2,
        total_absen: history.length,
        status: lastLog ? lastLog.status : 'on-time',
        history: history
    };
}

function generateDummyEmployees() {
    var employees = [
        { id: 1, nama: 'Deuwi Satriya Irawan', outlet_id: 1, shift_id: 2 },
        { id: 2, nama: 'Budi Santoso', outlet_id: 1, shift_id: 1 },
        { id: 3, nama: 'Siti Rahayu', outlet_id: 2, shift_id: 2 },
        { id: 4, nama: 'Agus Wijaya', outlet_id: 2, shift_id: 1 },
        { id: 5, nama: 'Dewi Lestari', outlet_id: 3, shift_id: 2 },
        { id: 6, nama: 'Joko Widodo', outlet_id: 3, shift_id: 1 },
        { id: 7, nama: 'Rina Anggraini', outlet_id: 1, shift_id: 2 },
        { id: 8, nama: 'Andi Pratama', outlet_id: 2, shift_id: 3 }
    ];

    var result = employees.map(function (emp) {
        var history = generateHistoryForEmployeeId(emp.id);
        var lastLog = history.length > 0 ? history[history.length - 1] : null;
        return {
            id: emp.id,
            nama: emp.nama,
            outlet_id: emp.outlet_id,
            shift_id: emp.shift_id,
            total_absen: history.length,
            status: lastLog ? lastLog.status : 'on-time',
            history: history
        };
    });
    return result;
}


document.addEventListener('alpine:init', function () {
    // ─── COMPONENT: LOGIN APP ──────────────────────────────────────────

    Alpine.data('loginApp', function () {
        return {
            email: 'admin@aam-group.com',
            password: 'password',
            loading: false,
            error: null,
            showPassword: false,

            init: function () {
                var user = localStorage.getItem('user');
                if (user) {
                    window.location.href = 'rekap.html';
                }
            },

            togglePassword: function () {
                this.showPassword = !this.showPassword;
            },

            login: function () {
                this.loading = true;
                this.error = null;
                setTimeout(function () {
                    if (this.email === 'admin@aam-group.com' && this.password === 'password') {
                        var user = { name: 'Administrator', email: this.email };
                        localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = 'rekap.html';
                    } else {
                        this.error = 'Email atau password salah!';
                    }
                    this.loading = false;
                }.bind(this), 500);
            }
        };
    });

    // ─── COMPONENT: PRESENCE APP ──────────────────────────────────────

    Alpine.data('presenceApp', function () {
        return {
            outlets: [
                { id: 1, name: 'My Fried Chicken' },
                { id: 2, name: 'Raja Kepiting' },
                { id: 3, name: 'Ayam Bebek Ganza' }
            ],
            shiftsMap: {
                1: [
                    { id: 1, name: 'Shift Pagi', start: '07:00', end: '15:00', label: 'Pagi' },
                    { id: 2, name: 'Shift Sore', start: '15:00', end: '23:00', label: 'Sore' }
                ],
                2: [
                    { id: 1, name: 'Shift Pagi', start: '08:00', end: '16:00', label: 'Pagi' },
                    { id: 2, name: 'Shift Sore', start: '16:00', end: '00:00', label: 'Sore' },
                    { id: 3, name: 'Shift Malam', start: '00:00', end: '08:00', label: 'Malam' }
                ],
                3: [
                    { id: 1, name: 'Shift Pagi', start: '08:00', end: '16:00', label: 'Pagi' },
                    { id: 2, name: 'Shift Sore', start: '16:00', end: '00:00', label: 'Sore' },
                    { id: 3, name: 'Shift Malam', start: '00:00', end: '08:00', label: 'Malam' }
                ]
            },
            selectedOutletId: null,
            selectedShiftId: null,
            presenceType: 'masuk',
            name: 'Deuwi Satriya Irawan',
            isSelf: true,
            isSubmitting: false,

            modalIcon: '✅',
            modalTitle: 'Presence Result',
            modalMessage: '',
            modalLate: false,
            modalLateMessage: '',
            modalPhoto: false,
            modalPhotoPreview: null,

            currentTime: '--:--:--',
            clockInterval: null,
            photoFile: null,
            photoPreview: null,

            user: null,

            get shifts() {
                if (!this.selectedOutletId) return [];
                return this.shiftsMap[this.selectedOutletId] || [];
            },

            get isFormValid() {
                return this.selectedOutletId && this.selectedShiftId !== null && this.name.trim().length > 0;
            },

            initClock: function () {
                this.user = checkAuth();
                this.updateClock();
                if (this.clockInterval) clearInterval(this.clockInterval);
                var self = this;
                this.clockInterval = setInterval(function () { self.updateClock(); }, 1000);
            },

            updateClock: function () {
                var now = new Date();
                this.currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');
            },

            onOutletChange: function () {
                this.selectedShiftId = null;
            },

            parseTimeToMinutes: function (timeStr) {
                var parts = timeStr.split(':').map(Number);
                return parts[0] * 60 + parts[1];
            },

            handlePhoto: function (event) {
                var file = event.target.files[0];
                if (!file) return;
                this.photoFile = file;
                var reader = new FileReader();
                var self = this;
                reader.onload = function (e) { self.photoPreview = e.target.result; };
                reader.readAsDataURL(file);
                event.target.value = '';
            },

            showPresenceModal: function (icon, title, message, late, lateMsg, photo) {
                this.modalIcon = icon || '✅';
                this.modalTitle = title || 'Presence Result';
                this.modalMessage = message || 'Thank you for your presence!';
                this.modalLate = late || false;
                this.modalLateMessage = lateMsg || '';
                this.modalPhoto = photo !== null && photo !== undefined;
                this.modalPhotoPreview = photo;

                var el = document.getElementById('presenceModal');
                if (el) {
                    try {
                        var existing = bootstrap.Modal.getInstance(el);
                        if (existing) existing.dispose();
                        var modal = new bootstrap.Modal(el);
                        modal.show();
                    } catch (e) {
                        console.warn('Modal error:', e);
                        alert(message);
                    }
                } else {
                    console.error('presenceModal not found');
                    alert(message);
                }
            },

            showToast: function (message) {
                var el = document.getElementById('toastModal');
                if (el) {
                    var msgEl = el.querySelector('.toast-message');
                    if (msgEl) msgEl.textContent = message;
                    var modal = new bootstrap.Modal(el);
                    modal.show();
                }
            },

            resetForm: function () {
                this.photoFile = null;
                this.photoPreview = null;
                if (this.$refs && this.$refs.photoInput) {
                    this.$refs.photoInput.value = '';
                }
                this.selectedShiftId = null;
                this.presenceType = 'masuk';
                this.name = this.isSelf ? 'Deuwi Satriya Irawan' : '';
            },

            submitPresence: function () {
                if (!this.isFormValid || this.isSubmitting) return;
                this.isSubmitting = true;

                try {
                    var outlet = this.outlets.find(function (o) { return o.id === this.selectedOutletId; }.bind(this));
                    var shift = this.shifts.find(function (s) { return s.id === this.selectedShiftId; }.bind(this));
                    if (!outlet || !shift) {
                        this.showPresenceModal('❌', 'Error', 'Outlet or Shift not found.');
                        this.isSubmitting = false;
                        return;
                    }

                    var start = this.parseTimeToMinutes(shift.start);
                    var end = this.parseTimeToMinutes(shift.end);
                    var now = new Date();
                    var nowMin = now.getHours() * 60 + now.getMinutes();

                    var lateMin = 0, isLate = false, lateType = '';

                    if (this.presenceType === 'masuk') {
                        var diff = nowMin - start;
                        if (diff > 15) {
                            isLate = true;
                            lateMin = Math.floor(diff);
                            lateType = 'Check In';
                        }
                    } else {
                        var diff = nowMin - end;
                        if (diff > 30) {
                            isLate = true;
                            lateMin = Math.floor(diff);
                            lateType = 'Check Out';
                        }
                    }

                    var label = this.presenceType === 'masuk' ? 'Check In' : 'Check Out';

                    var msg = 'Hello ' + this.name.trim() + ', your ' + label + ' has been successfully recorded! 🙏\n\n';
                    msg += '📍 Outlet: ' + outlet.name + '\n';
                    msg += '⏰ Shift: ' + shift.name + ' (' + shift.start + ' - ' + shift.end + ')\n\n';

                    if (isLate) {
                        msg += '⚠️ Status: Late by ' + lateMin + ' minute(s) for your scheduled shift.';
                    } else {
                        msg += '✅ Status: On Time. Great job, keep up the good work! 💪';
                    }

                    var lateMsg = isLate ?
                        '⏰ Late by ' + lateMin + ' minute(s) (Tolerance: ' + (this.presenceType === 'masuk' ? '15' : '30') + ' mins)' :
                        '';

                    this.showPresenceModal(
                        isLate ? '⚠️' : '✅',
                        isLate ? 'Presence Warning' : 'Presence Success',
                        msg,
                        isLate,
                        lateMsg,
                        this.photoPreview || null
                    );

                    this.resetForm();
                    this.isSubmitting = false;
                } catch (e) {
                    console.error(e);
                    this.showPresenceModal('❌', 'Error', 'A system error occurred. Please try again.');
                    this.isSubmitting = false;
                }
            },

            // ─── LOGOUT METHOD ───
            logout: function () {
                console.log('Logout dari presenceApp');
                logout(); // panggil fungsi global
            },

            goHome: function () {
                window.location.assign('index.html');
            }
        };
    });

    // ─── COMPONENT: REKAP APP ─────────────────────────────────────────

    Alpine.data('rekapApp', function () {
        return {
            currentTime: '--:--:--',
            clockInterval: null,
            outlets: [
                { id: 1, name: 'My Fried Chicken' },
                { id: 2, name: 'Raja Kepiting' },
                { id: 3, name: 'Ayam Bebek Ganza' }
            ],
            shifts: [
                { id: 1, name: 'Pagi' },
                { id: 2, name: 'Sore' },
                { id: 3, name: 'Malam' }
            ],
            selectedOutletId: null,
            selectedShiftId: null,
            filteredData: [],
            allData: [],
            user: null,

            init: function () {
                this.user = checkAuth();
                this.updateClock();
                var self = this;
                this.clockInterval = setInterval(function () { self.updateClock(); }, 1000);
                this.loadData();
            },

            updateClock: function () {
                var now = new Date();
                this.currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');
            },

            loadData: function () {
                var dummyEmployees = generateDummyEmployees();
                this.allData = dummyEmployees.map(function (emp) {
                    return {
                        id: emp.id,
                        nama: emp.nama,
                        outlet_id: parseInt(emp.outlet_id),
                        shift_id: parseInt(emp.shift_id),
                        total_absen: parseInt(emp.total_absen),
                        status: emp.status
                    };
                });
                this.selectedOutletId = null;
                this.selectedShiftId = null;
                this.applyFilter();
            },

            applyFilter: function () {
                var filtered = this.allData.slice();

                if (this.selectedOutletId !== null && this.selectedOutletId !== '') {
                    var outletId = parseInt(this.selectedOutletId);
                    filtered = filtered.filter(function (e) {
                        return parseInt(e.outlet_id) === outletId;
                    }.bind(this));
                }

                if (this.selectedShiftId !== null && this.selectedShiftId !== '') {
                    var shiftId = parseInt(this.selectedShiftId);
                    filtered = filtered.filter(function (e) {
                        return parseInt(e.shift_id) === shiftId;
                    }.bind(this));
                }

                this.filteredData = filtered;
            },

            viewDetail: function (id) {
                var params = new URLSearchParams();
                params.append('id', id);
                if (this.selectedOutletId) params.append('outlet', this.selectedOutletId);
                if (this.selectedShiftId) params.append('shift', this.selectedShiftId);
                window.location.href = 'detail.html?' + params.toString();
            },

            getOutletName: function (outletId) {
                var found = this.outlets.find(function (o) { return o.id === parseInt(outletId); });
                return found ? found.name : '-';
            },

            getShiftName: function (shiftId) {
                var found = this.shifts.find(function (s) { return s.id === parseInt(shiftId); });
                return found ? found.name : '-';
            },

            getRowClass: function (status) {
                if (status === 'on-time') return 'table-success';
                if (status === 'late-5-15') return 'table-warning';
                if (status === 'late-30-60') return 'table-danger';
                return '';
            },

            getBadgeClass: function (status) {
                if (status === 'on-time') return 'bg-success';
                if (status === 'late-5-15') return 'bg-warning text-dark';
                if (status === 'late-30-60') return 'bg-danger';
                return 'bg-secondary';
            },

            getStatusLabel: function (status) {
                if (status === 'on-time') return 'On Time';
                if (status === 'late-5-15') return 'Late 5-15 min';
                if (status === 'late-30-60') return 'Late 30-60 min';
                return '-';
            },

            showToast: function (message) {
                var el = document.getElementById('toastModal');
                if (el) {
                    var msgEl = el.querySelector('.toast-message');
                    if (msgEl) msgEl.textContent = message;
                    var modal = new bootstrap.Modal(el);
                    modal.show();
                }
            },

            // ─── LOGOUT METHOD ───
            logout: function () {
                console.log('Logout dari rekapApp');
                logout(); // panggil fungsi global
            },

            goHome: function () {
                window.location.assign('index.html');
            }
        };
    });

    // ─── COMPONENT: DETAIL APP ────────────────────────────────────────

    Alpine.data('detailApp', function () {
        return {
            currentTime: '--:--:--',
            clockInterval: null,
            employee: null,
            loading: true,
            employeeId: null,
            outletId: null,
            shiftId: null,
            outlets: [
                { id: 1, name: 'My Fried Chicken' },
                { id: 2, name: 'Raja Kepiting' },
                { id: 3, name: 'Ayam Bebek Ganza' }
            ],
            shifts: [
                { id: 1, name: 'Pagi' },
                { id: 2, name: 'Sore' },
                { id: 3, name: 'Malam' }
            ],
            currentDate: null,
            calendarDays: [],
            dayStatusMap: {},
            minDate: null,
            maxDate: null,
            user: null,

            get canPrev() {
                if (!this.currentDate || !this.minDate) return false;
                var currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                var minMonth = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1);
                return currentMonth > minMonth;
            },

            get canNext() {
                if (!this.currentDate || !this.maxDate) return false;
                var currentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                var maxMonth = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
                return currentMonth < maxMonth;
            },

            init: function () {
                this.user = checkAuth();
                this.updateClock();
                var self = this;
                this.clockInterval = setInterval(function () { self.updateClock(); }, 1000);
                var params = new URLSearchParams(window.location.search);
                var idParam = params.get('id');
                if (!idParam) {
                    this.loading = false;
                    this.employee = null;
                    return;
                }
                this.employeeId = parseInt(idParam);
                if (isNaN(this.employeeId)) {
                    this.loading = false;
                    this.employee = null;
                    return;
                }
                this.outletId = parseInt(params.get('outlet')) || null;
                this.shiftId = parseInt(params.get('shift')) || null;
                this.loadDetail();
            },

            updateClock: function () {
                var now = new Date();
                this.currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');
            },

            loadDetail: function () {
                this.loading = true;
                var empData = getDummyEmployee();

                if (empData.id !== this.employeeId) {
                    this.loading = false;
                    this.employee = null;
                    return;
                }

                var outlet = this.outlets.find(function (o) { return o.id === empData.outlet_id; });
                var shift = this.shifts.find(function (s) { return s.id === empData.shift_id; });

                var totalAbsen = empData.history.length;

                this.employee = {
                    id: empData.id,
                    nama: empData.nama,
                    outlet_id: empData.outlet_id,
                    shift_id: empData.shift_id,
                    total_absen: totalAbsen,
                    status: empData.status,
                    outlet_name: outlet ? outlet.name : 'Unknown',
                    shift_name: shift ? shift.name : 'Unknown',
                    history: empData.history
                };

                this.dayStatusMap = {};
                empData.history.forEach(function (log) {
                    this.dayStatusMap[log.date] = log.status;
                }.bind(this));

                var history = empData.history;
                if (history.length > 0) {
                    var firstDate = new Date(history[0].date);
                    var lastDate = new Date(history[history.length - 1].date);
                    this.minDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
                    this.maxDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                } else {
                    this.minDate = new Date(2026, 4, 1);
                    this.maxDate = new Date(2026, 5, 1);
                }

                if (!this.currentDate || this.currentDate < this.minDate) {
                    this.currentDate = new Date(this.minDate);
                }

                this.renderCalendar();
                this.loading = false;
            },

            renderCalendar: function () {
                if (!this.currentDate) return;
                var year = this.currentDate.getFullYear();
                var month = this.currentDate.getMonth();

                var firstDay = new Date(year, month, 1).getDay();
                var daysInMonth = new Date(year, month + 1, 0).getDate();
                var today = new Date();
                today.setHours(0, 0, 0, 0);

                var days = [];

                for (var i = 0; i < firstDay; i++) {
                    days.push(null);
                }

                for (var d = 1; d <= daysInMonth; d++) {
                    var dateObj = new Date(year, month, d);
                    var dateStr = dateObj.toISOString().split('T')[0];
                    var status = this.dayStatusMap[dateStr] || null;
                    var isPast = dateObj <= today;
                    days.push({
                        date: d,
                        dateStr: dateStr,
                        status: isPast ? status : null,
                        isToday: dateObj.toDateString() === today.toDateString(),
                        isPast: isPast
                    });
                }

                while (days.length < 42) {
                    days.push(null);
                }

                this.calendarDays = days;
            },

            prevMonth: function () {
                var newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
                if (newDate >= this.minDate) {
                    this.currentDate = newDate;
                    this.renderCalendar();
                }
            },

            nextMonth: function () {
                var newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
                if (newDate <= this.maxDate) {
                    this.currentDate = newDate;
                    this.renderCalendar();
                }
            },

            get currentMonthYear() {
                if (!this.currentDate) return '';
                var months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                return months[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear();
            },

            getDayClass: function (day) {
                if (!day) return 'empty-cell';
                if (!day.isPast) return 'future-date';
                if (!day.status) return 'bg-calendar-no-data';
                if (day.status === 'on-time') return 'bg-calendar-on-time';
                if (day.status === 'late-5-15') return 'bg-calendar-late-5-15';
                if (day.status === 'late-30-60') return 'bg-calendar-late-30-60';
                return 'bg-calendar-no-data';
            },

            getBadgeClass: function (status) {
                if (status === 'on-time') return 'bg-success';
                if (status === 'late-5-15') return 'bg-warning text-dark';
                if (status === 'late-30-60') return 'bg-danger';
                return 'bg-secondary';
            },

            getStatusLabel: function (status) {
                if (status === 'on-time') return 'On Time';
                if (status === 'late-5-15') return 'Late 5-15';
                if (status === 'late-30-60') return 'Late 30-60';
                return '-';
            },

            showToast: function (message) {
                var el = document.getElementById('toastModal');
                if (el) {
                    var msgEl = el.querySelector('.toast-message');
                    if (msgEl) msgEl.textContent = message;
                    var modal = new bootstrap.Modal(el);
                    modal.show();
                }
            },

            // ─── LOGOUT METHOD ───
            logout: function () {
                console.log('Logout dari detailApp');
                logout(); // panggil fungsi global
            },

            goHome: function () {
                window.location.assign('index.html');
            }
        };
    });

});