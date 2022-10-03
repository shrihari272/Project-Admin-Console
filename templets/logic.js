var bnt = document.querySelector('.floating-bnt')
var all_py = ''
var all_c = ''
var all_php = ''
var all_task = ''
var id = ''
async function getAllItems() {
    spin.style.display = "block"
    document.querySelector('body').style.overflow = "hidden"
    ////////Accessing python files
    await fetch('/api/v1/task/section/Python').then((res) => {
        return res.json()
    })
        .then((data) => {
            if (data.status === 404) {
                body.innerHTML = "<h1>Something went wrong</h1>"
                return
            }
            all_py = `<h1>#Python</h1>`
            data.tasks.forEach((item, index) => {
                all_py += `
                        <label style="display:none;" class="id">${item._id}</label>
                        <div class="card" onclick="click_listen()">
                            <p class="desc">${item.description}</p>
                        <i class="fa fa-trash-o icon-del"></i>
                        </div>
                    `
            })
            if (data.size == 0) {
                all_py += `<div class="soon">
                            <p class="desc">Comming Soon</p>
                        </div>`
            }
            all_py = `<div class="section div-1">${all_py}</div>`
        })
    ////////Accessing C++ files
    await fetch('/api/v1/task/section/C++').then((res) => {
        return res.json()
    })
        .then((data) => {
            if (data.status === 404) {
                body.innerHTML = "<h1>Something went wrong</h1>"
                return
            }
            // let all_task = ''
            all_c = `<h1>#C++</h1>`
            data.tasks.forEach((item, index) => {
                all_c += `    <label style="display:none;" class="id">${item._id}</label>
                        <div class="card" onclick="click_listen()">
                            <p class="desc">${item.description}</p>
                        <i class="fa fa-trash-o icon-del"></i>
                        </div>
                    `
            })
            if (data.size === 0) {
                all_c += `<div class="soon">
                            <p class="desc">Comming Soon</p>
                        </div>`
            }
            all_c = `<div class="section div-2">${all_c}</div>`
            // document.querySelector('.content-space').innerHTML = all_py + all_c
        })
    ////////Accessing php files
    await fetch('/api/v1/task/section/Php').then((res) => {
        return res.json()
    })
        .then((data) => {
            if (data.status === 404) {
                body.innerHTML = "<h1>Something went wrong</h1>"
                return
            }
            all_php = `<h1>#Php</h1>`
            data.tasks.forEach((item, index) => {
                all_php += ` <label style="display:none;" class="id">${item._id}</label>
                        <div class="card" onclick="click_listen()">
                            <p class="desc">${item.description}</p>
                        <i class="fa fa-trash-o icon-del"></i>
                        </div>
                    `
            })
            if (data.size === 0) {
                all_php += `<div class="soon">
                            <p class="desc">Comming Soon</p>
                        </div>`
            }
            all_php = `<div class="section div-3">${all_php}</div>`
            document.querySelector('.content-space').innerHTML = all_py + all_c + all_php
        })
    spin.style.display = "none"
    spin.style.backgroundImage = "none"
    spin.style.backdropFilter = "blur(0px)"
    document.querySelector('body').style.overflow = "auto"
    click_listen()
}

////////////////Changs in add and back
function change() {
    if (bnt.innerText === '+') {
        var main = document.querySelector('.main')
        main.innerHTML = `<section class="content-input">
                <div class="content-space-input">
                    <select type="text" id="section" placeholder="Section">
                        <option value="select">--select--</option>
                        <option value="Python">#Python</option>
                        <option value="C++">#C++</option>
                        <option value="Php">#Php</option>
                    </select>    
                    <input type="text" id="description" placeholder="Description">   
                    <textarea id="code" placeholder="Code"></textarea>
                    <button id="submit" onclick="create()">Save</button>
                </div>
                <button class="floating-bnt" onclick="change()"><</button>
            </section>`
        bnt = document.querySelector('.floating-bnt')
    }
    else if (bnt.innerText === '<') {
        location.reload()
        bnt = document.querySelector('.floating-bnt')
    }
}

/////////////////////Creating files
async function create() {
    if (section.value === 'select' || description.value === '' || code.value === '') {
        alert('All field are required')
        return
    }
    spin.style.display = "block"
    await fetch('/api/v1/task/section/python', {
        method: 'POST',
        body: JSON.stringify({ section: section.value, description: description.value, code: code.value }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => {
        location.reload()
        // getAllItems()
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}


async function getItem() {
    spin.style.display = "block"
    var main = document.querySelector('.main')
    await fetch(`/api/v1/task/${id}`).then((data) => {
        return data.json()
    })
        .then((data) => {
            bnt.innerText = '<'
            main.innerHTML = data.task
        }).catch((e) => console.log(e))
    spin.style.display = "none"
}

function click_listen() {
    let i = 0
    var div_click = document.querySelectorAll(".card")
    var del_click = document.querySelectorAll(".fa")
    var label = document.querySelectorAll(".id")
    for (i = 0; i < div_click.length; i++) {
        let clicked = i
        div_click[i].addEventListener('click', (e) => {
            id = label[clicked].innerHTML;
            getItem();
        })
    }
    for (i = 0; i < div_click.length; i++) {
        let clicked = i
        del_click[i].addEventListener('click', (e) => {
            id = label[clicked].innerHTML;
            remove();
        })
    }
}

async function update() {
    if (section.value === 'select' || description.value === '' || code.value === '') {
        alert('All fields are required')
        return
    }
    spin.style.display = "block"
    await fetch(`/api/v1/task/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ id: id, section: section.value, description: description.value, code: code.value }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => {
        location.reload()
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}

async function remove() {
    spin.style.display = "block"
    await fetch(`/api/v1/task/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: id }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => {
        location.reload()
    }).catch((e) => console.log(e))
    spin.style.display = "none"
}

out.addEventListener('click', async (e) => {
    alert('Click on cancel to logout')
    await fetch('/logout').then((data) => {

    }).catch((e) => console.log(e))
    location.reload()
});

home.addEventListener('click', async (e) => {
    location.reload()
});

getAllItems()