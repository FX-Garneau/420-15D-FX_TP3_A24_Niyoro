/**
 * Classe HATEOAS
 * @param {any} [value] La valeur de l'instance
 * @param {[rel: string, method: string, href: string][]} [links] Les liens HATEOAS
 */
export function HATEOAS(value, links) {
   if (!(this instanceof HATEOAS))
      return new HATEOAS(value, links);
   Object.assign(this, value);
   this._links = {};
   links && links.forEach(link => this.addLink(link));
}

/**
 * Les liens HATEOAS
 * @type {object}
 */
HATEOAS.prototype._links = {};

/**
 * Ajoute un lien HATEOAS
 * @param {[rel: string, method: string, href: string]} link Le lien HATEOAS
 * @returns {HATEOAS} L'instance de la classe HATEOAS
 * @throws {TypeError} Si le lien n'est pas valide
 */
HATEOAS.prototype.addLink = function (link) {
   this._links[link[0]] = { method: link[1], href: link[2] };
   return this;
};

/**
 * Supprime un ou plusieurs liens HATEOAS
 * @param {...string} rels Les relations des liens à supprimer
 * @returns {HATEOAS} L'instance de la classe HATEOAS
 */
HATEOAS.prototype.removeLinks = function (...rels) {
   rels.forEach(rel => delete this._links[rel]);
   return this;
};

/**
 * Choisit les liens à conserver
 * @param {...string} rels Les relations des liens à conserver
 * @returns {HATEOAS} L'instance de la classe HATEOAS
 */
HATEOAS.prototype.pickLinks = function (...rels) {
   this._links = Object.fromEntries(Object.entries(this._links).filter(([rel]) => rels.includes(rel)));
   return this;
};

/**
 * Crée un nouveau constructeur de liens HATEOAS avec des liens supplémentaires
 * @param {[rel: string, method: string, href: string][]} links Les liens supplémentaires
 */
HATEOAS.withLinks = function (links) {
   return (value) => new HATEOAS(value, links);
}