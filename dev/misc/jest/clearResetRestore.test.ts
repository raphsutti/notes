import * as utils from "./clearResetRestore";

describe("giveMeFive", () => {
  it("shows how spyOn.mockImplementation is set up", () => {
    const giveMeFiveSpy = jest.spyOn(utils, "giveMeFive");

    //>>> Replace function implementation
    giveMeFiveSpy.mockImplementation(() => "mocked five");

    const result = utils.giveMeFive(); // "mocked five"
    expect(result).toBe("mocked five");
    expect(giveMeFiveSpy).toBeCalledTimes(1);
  });

  it("shows how mockClear works for spy", () => {
    const giveMeFiveSpy = jest.spyOn(utils, "giveMeFive");

    giveMeFiveSpy.mockImplementation(() => "mocked five");

    //>>>  Cleans internal state of mock (called 1 time)
    giveMeFiveSpy.mockClear();

    const result = utils.giveMeFive(); // "mocked five"
    expect(result).toBe("mocked five");
    expect(giveMeFiveSpy).toBeCalledTimes(1);
  });

  it("shows how mockReset works for spy", () => {
    const giveMeFiveSpy = jest.spyOn(utils, "giveMeFive");

    giveMeFiveSpy.mockImplementation(() => "mocked five");

    //>>> Cleans internal state of mock (called 1 time)
    //>>> Also destroys mockImplementation -> undefined
    giveMeFiveSpy.mockReset();

    const result = utils.giveMeFive(); // undefined
    expect(result).toBe(undefined);
    expect(giveMeFiveSpy).toBeCalledTimes(1);
  });

  it("shows how mockRestore works for spy", () => {
    const giveMeFiveSpy = jest.spyOn(utils, "giveMeFive");

    giveMeFiveSpy.mockImplementation(() => "mocked five");

    //>>> Cleans internal state of mock (called 1 time)
    //>>> Also destroys mockImplementation but restore it to original -> giveMeFive()
    giveMeFiveSpy.mockRestore();

    const result = utils.giveMeFive(); // "OG five"
    expect(result).toBe("OG five");
    expect(giveMeFiveSpy).toBeCalledTimes(0); // Mock was not called
  });
});
