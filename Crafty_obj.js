function Crafty (login,password,adress,port){
  this.login = login;
  this.password = password;
  this.adress = adress;
  this.port = port;
  this.game_servers = [];
	this.token = null;
};

Crafty.prototype.getToken = async function (){
	try{
		const res = await fetch(`${this.adress}:${this.port}/api/v2/auth/login`,{
			method: "POST",
			body: JSON.stringify({
				login: this.login,
				password: this.password,
			})
		});
		this.token = res.data.token;
		return true; 
	} catch (error){
		console.log(error);
		throw new Error(error);
	};
};

Crafty.prototype.invalidateToken = async function(){
	try{
		const res = await fetch(`${this.adress}:${this.port}/api/v2/auth/invalidate_tokens`,{
			method: "POST",
			headers: {
				authorization: `Bearer ${this.token}`
			}
		});
		return (res.status === 'ok');
	} catch (error) {
		throw new Error(error);
	};
};

Crafty.prototype.updateServers = async function(){
	try{
		const res = await fetch(`${this.adress}:${this.port}/api/v2/servers`,{
			method: "POST",
			headers: {
				authorization: `Bearer ${this.token}`
			}
		});
	} catch (error) {
		throw new Error(error);
	};

	if (res.status === 'ok'){
		this.game_servers = res.data
		return true;
	} else {
		throw new Error(`Response is not ok: ${res.status}`);
	};
};

Crafty.prototype.actionServer = async function(action , server_id){
	try{
		const res = await fetch(`${this.adress}:${this.port}/api/v2/servers/${server_id}/action/${action}`,{
			method: "POST",
			headers: {
				authorization: `Bearer ${this.token}`
			}
		});
	} catch (error) {
		console.log(error);
		throw new Error(error) ;
	};
	if (res.status === 'ok'){
		return true;
	} else {
		throw new Error(`Not able to ${action} : ${res.status}`);
	};
};

module.exports = Crafty;
