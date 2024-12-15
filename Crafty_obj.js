const { Agent, setGlobalDispatcher } = require('undici');

const agent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
});

setGlobalDispatcher(agent);
//disable ssl Cert
function Crafty (login,password,adress,port){
  this.login = login;
  this.password = password;
  this.adress = adress;
  this.port = port;
  this.game_servers = [];
	this.token = null;
	this.base_url = new URL(undefined,`https://${this.adress}:${this.port}`);
};

Crafty.prototype.getToken = async function (){
	var res;
	const req_url = new URL("/api/v2/auth/login",this.base_url.toString());
	try{
		res = await fetch(req_url.toString(),{
			method: "POST",
			body: JSON.stringify({
				login: this.login,
				password: this.password,
			})
		}).then(res => {return res.json()});
		this.token = res.data.token;
		return true; 
	} catch (error){
		throw new Error(error);
	};
};

Crafty.prototype.invalidateToken = async function(){
	try{
		const res = await fetch(`${this.adress}:${this.port}/api/v2/auth/invalidate_tokens`,{
			method: "POST",
			headers: {
				authorization: `Bearer ${this.token}`
			},
			agent: Agent,
		});
		return (res.status === 'ok');
	} catch (error) {
		throw new Error(error);
	};
};

Crafty.prototype.updateServers = async function(){
	const req_url = new URL("/api/v2/servers",this.base_url.toString());
	var res;
	try{
		res = await fetch(req_url.toString(),{
			method: "GET",
			headers: {
				authorization: `Bearer ${this.token}`
			},
			agent: Agent,
		}).then( res => {return res.json() });
	} catch (error) {
		throw new Error(error);
	};
	if (res.status === 'ok'){
		this.game_servers = res.data;
		return true;
	} else {
		throw new Error(`Response is not ok: ${res.status}`);
	};
};

Crafty.prototype.actionServer = async function(action , server_id){
	const POSSIBLE_ACTIONS = ["clone_server",
		"start_server",
		"stop_server", 
		"restart_server", 
		"kill_server", 
		"backup_server", 
		"update_executable"];

	if (!(POSSIBLE_ACTIONS.includes(action))){
		throw new Error("Action not possible");
	};
	req_url = new URL(`/api/v2/servers/${server_id}/action/${action}`,this.base_url.toString())
	var res;
	try{
		res = await fetch(req_url.toString(),{
			method: "POST",
			headers: {
				authorization: `Bearer ${this.token}`
			},
			agent: Agent,
		}).then(res => {return res.json()});
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
