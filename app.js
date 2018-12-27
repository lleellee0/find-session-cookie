const cookie = require('cookie');

const k_combinations = (set, k) => {
	let i, j, combs, head, tailcombs;

	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}

	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i + 1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

const combinations = (set) => {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

let cookies = cookie.parse('_gcl_au=1.1.250762447.1544339850; PREF=cvdm=grid&f5=20030&f1=50000000&al=ko; VISITOR_INFO1_LIVE=V5NM0h25N6I; enabledapps.uploader=0;');
console.log(combinations(Object.keys(cookies)));