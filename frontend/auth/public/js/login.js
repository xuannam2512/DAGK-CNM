function login() {

	var loginEntity = {
		username: $("#txt_username").val(),
		password: $("#txt_password").val()
	}


	var formBody = [];
	for (var property in loginEntity) {
  		var encodedKey = encodeURIComponent(property);
  		var encodedValue = encodeURIComponent(loginEntity[property]);
  		formBody.push(encodedKey + "=" + encodedValue);
	}
	formBody = formBody.join("&");

	axios({
		method: 'post',
		url: 'http://localhost:3000/api/users/login',
		data: formBody,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	.then(response => {
		var permission = response.data.user.permission;
		var link = '../app' + permission + '/index.html';
		$(location).attr('href', link);
	})
	.catch(err => {
		console.log("err");
	});
}