import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-left',
    showMethod: 'slide-down',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

const makeToast = (type, msg) => {
    Toast.fire({
        icon: type,
        title: msg,
    });
};

export default makeToast;