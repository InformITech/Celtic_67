(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });

})(jQuery);



async function updateStatus(id, need) {
    try {
        let response = await fetch(`/admin/updateStatus/?id=${id}&need=${need}`, {
            method: 'GET'
        })

        if (response.status === 200) {
            if (need === 'Block') {
                let statusElement = document.getElementById('status_' + id);
                let blockButton = document.getElementById('blockButton_' + id)
                statusElement.innerHTML = "<center>Active</center>"
                blockButton.innerHTML = "<center>Block</center>"
            } else if (need === "Admin") {
                let statusElement = document.getElementById('isAdmin_' + id);
                let adminButton = document.getElementById('adminButton_' + id)
                statusElement.innerHTML = "<center>Yes</center>"
                adminButton.innerHTML = "<center>User</center>"
            } else {
                let rowToDelete = document.getElementById('user_' + id);
                if (rowToDelete) {
                    rowToDelete.remove();
                }
            }
        } else if (response.status === 201) {
            if (need === 'Block') {
                let statusElement = document.getElementById('status_' + id);
                let blockButton = document.getElementById('blockButton_' + id)
                statusElement.innerHTML = "<center>Blocked</center>"
                blockButton.innerHTML = "<center>Unblock</center>"
            } else if (need === 'Admin') {
                let statusElement = document.getElementById('isAdmin_' + id);
                let adminButton = document.getElementById('adminButton_' + id)
                statusElement.innerHTML = "<center>No</center>"
                adminButton.innerHTML = "<center>Admin</center>"
            }
        }
    } catch (e) {
        console.error(e);
    }
}





function showSaveButton(id) {
    document.getElementById('saveBtn_' + id).style.display = 'inline-block'
}
function addProduct() {
    window.location.href = '/admin/add-product'
}
function viewProducts() {
    let fullCards = document.getElementById('fullCards')
    fullCards.style.display = 'block'
}
function updateProducts(id) {
    window.location.href = `/admin/update-product/?id=${id}`
}
async function updateCategory(id, need) {
    if (need === 'update') {
        let data = document.getElementById('genre_' + id).value
        if (data != "") {
            let response = await fetch('/admin/update-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data, id, need })
            })
            if (response.status === 200) {
                Swal.fire(
                    'Changes Saved Sucessfully!',
                    'success'
                )
                document.getElementById('saveBtn_' + id).style.display = 'none'
            }
        }
    } else if (need === 'remove') {
        let response = await fetch('/admin/update-category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, need })
        })
        if (response.status === 201) {
            document.getElementById('removeBtn_' + id).innerHTML = 'Show'
            document.getElementById('visible_' + id).innerHTML = 'Hidden'
            Swal.fire(
                'Product Hidden!',
                'success'
            )
        } else if (response.status === 200) {
            document.getElementById('removeBtn_' + id).innerHTML = 'Hide'
            document.getElementById('visible_' + id).innerHTML = 'Visible'
            Swal.fire(
                'Product Visible!',
                'success'
            )
        }
    }
}

function showInput() {
    let deductionType = document.getElementById('deductionType').value
    if (deductionType === 'Percentage') {
        document.getElementById('perceBox').style.display = 'block'
    } else {
        document.getElementById('perceBox').style.display = 'none'
    }
}
function dateValidation(date) {
    date = new Date(date)
    let current = new Date()
    if (date > current) {
        return true
    } else {
        return false
    }
}


async function deleteCoupon(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
        )
        let response = await fetch('/admin/deleteCoupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        if (response.status === 200) {
            document.getElementById('data_' + id).remove()
        }
    } else if (result.isDenied) {
        await Swal.fire('Changes are not saved', '', 'info');
    }
}


async function updateForm(id) {
    let name = document.getElementById('name_' + id).value
    let validity = document.getElementById('validity_' + id).value
    if (name != "") {
        if (dateValidation(validity)) {
            let madeFor = document.getElementById('madeFor_' + id).value
            let validFrom = document.getElementById('validFrom_' + id).value
            let deduction = document.getElementById('deduction_' + id).value
            if (madeFor && validFrom && deduction) {
                const result = await Swal.fire({
                    title: 'Do you want to update the coupon?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    denyButtonText: `Don't Update`,
                });
                if (result.isConfirmed) {
                    let response = await fetch('/admin/updateCoupon', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, name, validity, madeFor, validFrom, deduction })
                    })
                    if (response.status === 200) {
                        Swal.fire('Updated!', '', 'success');
                    }
                } else if (result.isDenied) {
                    Swal.fire('No coupon updated', '', 'info');
                }
            } else {
                Swal.fire(
                    'Error!',
                    'Cannot Set Empty Data',
                    'Sorry'
                )
            }
        } else {
            Swal.fire(
                'Error!',
                'Enter Valid Date',
                'Sorry'
            )
        }
    } else {
        Swal.fire(
            'Error!',
            'Enter Valid Coupon name',
            'Sorry'
        )
    }
}


async function manageOrder(id, need, reason) {
    let question = (need === 'success') ? 'Yes confirm order' : 'Yes cancel order'
    let result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: question
    })
    if (result.isConfirmed) {
        let response = await fetch('/admin/manageOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, need, reason })
        })
        if (response.status === 200) {
            await Swal.fire(
                'Cancelled!',
                'The order has been cancelled.',
                'success'
            )
            window.location.href = '/admin/orders'
        } else if (response.status === 201) {
            await Swal.fire(
                'Confirmed!',
                'The order has been confirmed.',
                'success'
            )
            window.location.href = '/admin/orders'
        } else {
            await Swal.fire(
                'Sorry!',
                'Unidentified Error',
                'error'
            )
            location.reload()
        }
    }
}