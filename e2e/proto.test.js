describe('Example', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        // reload is better for simple apps. For bigger apps, use launchApp({newInstance: true})
        await device.reloadReactNative(); 
    });

    it('should test tap on a button', async () => {
        // by.id is recommanded bu by.text can work also
        await element(by.id('test_id')).tap();

        await expect(element(by.text('The button has been pressed'))).toBeVisible();
        // await expect(element(by.id('id_for_text'))).toHaveText('The button has been pressed');
    });
});