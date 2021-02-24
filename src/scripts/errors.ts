export class NoStationExtension extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, NoStationExtension.prototype);
    }

}