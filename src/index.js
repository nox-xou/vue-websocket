// import IO from "socket.io-client";

export default {

	install(Vue, connection) {

		Vue.prototype.$socket = connection

		let addListeners = function() {
			if (this.$options["sockets"]) {
				let sockets = this.$options.sockets;
				for (let socket in sockets) {
					let socketname = socket
					let conf = sockets[socket]

					if (!this.$socket[socketname]) {
						console.log(`Vue component socket '${socketname}' events has found!. but socket instance plugin not created yet.`)
						continue
					}

					if (conf.events) {
						let prefix = conf.prefix || "";
						Object.keys(conf.events).forEach((key) => {
							let func = conf.events[key].bind(this);
							this.$socket[socketname].on(prefix + key, func);
							conf.events[key].__binded = func;
						});
					}
				}
			}
		};

		let removeListeners = function() {
			if (this.$options["sockets"]) {
				let sockets = this.$options.sockets;
				for (let socket in sockets) {
					let socketname = socket
					let conf = sockets[socket]

					if (!this.$socket[socketname]) {
						console.log(`Vue component socket '${socketname}' events has found!. but socket instance plugin not created yet.`)
						continue
					}

					this.$socket[socketname].disconnect();

					if (conf.events) {
						let prefix = conf.prefix || "";
						Object.keys(conf.events).forEach((key) => {
							this.$socket[socketname].off(prefix + key, conf.events[key].__binded);
						});
					}
				}
			}
		};

		Vue.mixin({
			[Vue.version.indexOf('2') === 0 ? "beforeCreate" : "beforeCompile"]: addListeners,
			beforeDestroy: removeListeners
		});

	}

};
