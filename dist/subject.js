export class Subject {
    observers = [];
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}
//# sourceMappingURL=subject.js.map