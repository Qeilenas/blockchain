function submitInfo() {
  var file = document.getElementById("file").files[0]
  // убеждаемся, что выбранный файл существует и текстовое поле не пусто
  if (file) {
    var owner = document.getElementById("owner").value
    if (owner == "") {
      alert("Please enter owner name")
    } else {
      var reader = new FileReader()
      // считываем содержимое файла в буферный массив
      reader.onload = function (event) {
        // передаем массив методу, чтобы получить хеш содержимого буферного массива
        var hash = sha1(event.target.result)
        // используем фреймворк jQuery для формирования AJAX-запроса по адресу /submit
        $.get("/submitInfo?hash=" + hash + "&owner=" + owner, function (data) {
          // отображение информации (хеша транзакций) в блоке сообщений
          if (data == "Error") {
            $("#text_message").text("An error occured.")
          } else {
            $("#text_message").html("Transaction hash: " + data)
          }
        })
      }
      reader.readAsArrayBuffer(file)
    }
  } else {
    alert("Please select a file")
  }
}

function getInfo() {
  var file = document.getElementById("file").files[0]
  // убеждаемся, что выбранный файл существует и текстовое поле не пусто
  if (file) {
    var reader = new FileReader()
    // считываем содержимое файла в буферный массив
    reader.onload = function (event) {
      // передаем массив методу, чтобы получить хеш содержимого буферного массива
      var hash = sha1(event.target.result)
      // используем фреймворк jQuery для формирования AJAX-запроса по адресу /submit
      $.get("/getInfo?hash=" + hash, function (data) {
        // отображение информации (хеша транзакций) в блоке сообщений
        if (data[0] == 0 && data[1] == "") {
          $("#text_message").html("File not found.")
        } else {
          $("#text_message").html(
            "Timestamp: " + data[0] + " Owner: " + data[1]
          )
        }
      })
    }
    reader.readAsArrayBuffer(file)
  } else {
    alert("Please select a file")
  }
}

document.getElementById("send").onclick = submitInfo
document.getElementById("get").onclick = getInfo

var socket = new WebSocket("ws://localhost:8080/")
