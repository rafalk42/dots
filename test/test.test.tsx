import {DotsGameModel} from '../src/model/dots'


test('Player cycling', () => {
    let model: DotsGameModel = new DotsGameModel();

    expect(model.getPlayer()).toBe(1);
    model.nextPlayer();
    expect(model.getPlayer()).toBe(2);
    model.nextPlayer();
    expect(model.getPlayer()).toBe(1);
    model.nextPlayer();
    expect(model.getPlayer()).toBe(2);
});