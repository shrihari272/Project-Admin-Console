var bnt = document.querySelector('.floating-bnt');
var all_section = '';
var all_section_arrange = '';
var btn_section = '';
var id = '';
var code;
var toolbarOpt = [
    ['bold','italic','underline','strike'],
    ['code-block']
]
var options = {
modules: {
    toolbar: toolbarOpt,
},
placeholder: 'Code',
theme: 'snow'
};
async function getAllItems() {
    spin.style.display = "block"
    document.querySelector('body').style.overflow = "hidden"
    ////////Accessing All files

    await fetch('/api/v1/section').then((res) => {
        return res.json()
    })
        .then((data) => {
            data.section.forEach((sec) => {
                fetch(`/api/v1/task/section/${sec.section}`).then((res) => {
                    return res.json()
                })
                    .then((each_sec) => {

                        all_section += `<h1>#${sec.section}</h1>`
                        if (each_sec.size == 0) {
                            all_section += `<div class="soon">
                                        <p class="desc">No Code Uploded</p>
                                    </div>`
                        }
                        each_sec.tasks.forEach((sec_data) => {
                            all_section += `
                            <label style="display:none;" class="id">${sec_data._id}</label>
                            <div class="card" onclick="click_listen()">
                                <p class="desc">${sec_data.description}</p>
                            <i class="fa fa-trash-o icon-del"></i>
                            </div>
                            `
                        })
                        all_section_arrange += `<div class="section">${all_section}</div>`
                        all_section = ''
                        document.querySelector('.content-space').innerHTML = all_section_arrange

                    }).then(() => {
                        click_listen()
                    })

            })

        }).catch((e) => console.log(e))
    spin.style.display = "none"
    spin.style.backgroundImage = "none"
    spin.style.backdropFilter = "blur(0px)"
    document.querySelector('body').style.overflow = "auto"
}

////////////////Change in add and back
async function change() {
    let option = ''
    await fetch('/api/v1/section').then((res) => {
        return res.json()
    })
        .then((data) => {
            data.section.forEach((opt) => {
                option += `<option value="${opt.section}">${opt.section}</option>`
            })
        })
    if (bnt.innerText === '+') {
        var main = document.querySelector('.main')
        main.innerHTML = `<section class="content-input">
                <div class="content-space-input">
                    <select type="text" id="section" placeholder="Section">
                        <option value="select">--select--</option>
                        ${option}
                    </select>    
                    <input type="text" id="description" placeholder="Description">   
                    <div id="code"></div>
                    <button id="submit" onclick="create()">Save</button>
                </div>
                <button class="floating-bnt" onclick="change()"><</button>
            </section>`
        code = new Quill('#code', options)
        bnt = document.querySelector('.floating-bnt')
        document.querySelector('.sec-bnt').style.display = 'none';
    }
    else if (bnt.innerText === '<') {
        location.reload()
    }
}

/////////////////////Creating files
async function create() {
    if (section.value === 'select' || description.value === '' || code.root.innerHTML === '<p><br></p>') {
        alert('All field are required')
        return
    }
    spin.style.display = "block"
    await fetch('/api/v1/task/section/python', {
        method: 'POST',
        body: JSON.stringify({ section: section.value, description: description.value, code: code.root.innerHTML }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => {
        snackBar("Code Inserted")
        setTimeout(function () { location.reload() }, 1000);
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}


async function getItem() {
    spin.style.display = "block"
    document.querySelector('.sec-bnt').style.display = 'none';
    var main = document.querySelector('.main')
    await fetch(`/api/v1/task/${id}`).then((data) => {
        return data.json()
    })
        .then((data) => {
            bnt.innerText = '<'
            var editor = `
            <section class="content-input">
            <div class="content-space-input">
                <select type="text" id="section" placeholder="Section">
                <option value="${data.section}">#${data.section}</option>
                </select>     
                <input type="text" id="description" placeholder="Description" value="${data.description}"> 
                <div id="code"></div>
                <button id="submit" onclick="update()">Edit</button>
            </div>
            <button class="floating-bnt" onclick="change()"><</button>
        </section>
            `
            main.innerHTML = editor
            code = new Quill('#code', options) 
            code.root.innerHTML = data.code
        }).catch((e) => console.log(e))
    spin.style.display = "none"
}

function click_listen() {
    let i = 0
    let click = false
    var div_click = document.querySelectorAll(".card")
    var del_click = document.querySelectorAll(".fa")
    var label = document.querySelectorAll(".id")
    for (i = 0; i < del_click.length; i++) {
        let clicked = i
        del_click[i].addEventListener('click', async (e) => {
            id = label[clicked].innerHTML;
            click = true
            await remove();
        })
    }
    for (i = 0; i < div_click.length; i++) {
        let clicked = i
        div_click[i].addEventListener('click', (e) => {
            id = label[clicked].innerHTML;
            if (click)
                return
            getItem();
        })
    }
}

async function update() {
    if (section.value === 'select' || description.value === '' || code.root.innerHTML === '<p><br></p>') {
        alert('All fields are required')
        return
    }
    spin.style.display = "block"
    await fetch(`/api/v1/task/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id: id, section: section.value, description: description.value, code: code.root.innerHTML }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => {
        snackBar("Code Edited")
        setTimeout(function () { location.reload() }, 1000);
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}

async function remove() {
    spin.style.display = "block"
    await fetch(`/api/v1/task/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
    }).then(async () => {
        snackBar("Code Deleted")
        setTimeout(function () { location.reload() }, 400);
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}

out.addEventListener('click', async (e) => {
    await fetch('/api/v1/logout', {
        method: 'DELETE',
        body: JSON.stringify({ id: id }),
        headers: {
            "Content-Type": "application/json"
        },
    },).then((data) => {
        location.reload()
    }).catch((e) => console.log(e))
});

home.addEventListener('click', async (e) => {
    location.reload()
});

function snackBar(msg) {
    var x = document.getElementById("snackbar");
    x.innerHTML = msg
    x.className = "show"
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

async function btn_sec() {
    spin.style.display = "block"
    await fetch('/api/v1/section').then((res) => {
        return res.json()
    })
        .then((data) => {
            btn_section = `<h1 style="align-self: flex-start;margin-left: 10px;">#Section</h1>`
            data.section.forEach((sec) => {
                btn_section += `
            <div class="sec-del" id="${sec._id}">
                <p class="desc">${sec.section}</p>
            </div>`
            })
            btn_section = `<div class="sec-list">${btn_section}</div>`
            document.querySelector('.content-space').innerHTML = btn_section
            btn_section = ''
            sec_listen()
            bnt.setAttribute('onclick', "sec_input()")
        }).catch((e) => console.log(e))
    spin.style.display = "none"
}

async function sec_delete(id, data) {
    spin.style.display = "block"
    await fetch(`/api/v1/section/${id} ${data}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: id }),
        headers: {
            "Content-Type": "application/json"
        },
    },).then(async (data) => {
        snackBar('Loading ...')
        await btn_sec()
        setTimeout(function () { snackBar('Section Deleted') }, 1000);
    })
    spin.style.display = "none"
}

async function sec_save() {
    spin.style.display = "block"
    regex = /[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi
    if (section.value === '') {
        alert("Section field required.")
        spin.style.display = "none"
        return
    }
    if (regex.exec(section.value)) {
        spin.style.display = "none"
        alert("Invalid name. Special characters are not allowed.");
        return
    }
    await fetch(`/api/v1/section/${id}`, {
        method: 'POST',
        body: JSON.stringify({ section: section.value }),
        headers: {
            "Content-Type": "application/json"
        },
    },).then((res) => res.json()).then(async (data) => {
        snackBar('Loading ...')
        if (data.msg) {
            setTimeout(function () { snackBar('Section Already Exist') }, 1000);
            return
        }
        setTimeout(function () { snackBar('Section Saved') }, 1000);
        bnt.innerHTML = '+'
        await btn_sec()
    })
    spin.style.display = "none"
}

function sec_listen() {
    let i = 0
    var div_click = document.querySelectorAll(".sec-del")
    var sec_click = document.querySelectorAll(".desc")
    for (i = 0; i < div_click.length; i++) {
        let clicked = i
        div_click[i].addEventListener('click', (e) => {
            sec_delete(div_click[clicked].id, sec_click[clicked].innerHTML)
        })
    }
}

function sec_input() {
    document.querySelector('.sec-list').innerHTML = `
    <div class="sec-input">
    <input type="text sec-text" id="section" style="width:60%;height:2.7rem;" placeholder="#Section"> 
    <button id="submit" onclick="sec_save()" style="margin-bottom:5px; margin-left:5px;">Save</button>
    </div>
    `
    if (bnt.innerText === '<') {
        btn_sec()
        bnt.innerHTML = '+'
        return
    }
    bnt.innerHTML = "<"
}

getAllItems()