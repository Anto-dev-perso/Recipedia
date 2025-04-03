import {
    extractFieldFromImage,
    ingredientObject,
    ingredientQuantityPerPersons,
    personAndTimeObject,
    recognizeText,
    WarningHandler
} from "@utils/OCR";
import {ingredientTableElement, ingredientType, recipeColumnsNames} from "@customTypes/DatabaseElementTypes";
import TextRecognition, {TextBlock, TextLine, TextRecognitionResult} from "@react-native-ml-kit/text-recognition";
import {textSeparator} from "@styles/typography";


jest.mock('@react-native-ml-kit/text-recognition', () => ({
    __esModule: true,
    default: {
        recognize: jest.fn(),
    },
}));


const mockRecognizeText = TextRecognition.recognize as jest.Mock;
const mockWarn: WarningHandler = jest.fn();

describe('OCR Utility Functions', () => {

    const uriForOCR = 'not used';
    const baseState = {
        recipePreparation: [],
        recipePersons: 4,
        recipeIngredients: [],
    };

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('on title field', () => {
        const mockResultTitle: TextRecognitionResult = {
            text: 'POULET SAUCE\nSATAY (CACAHUETES\nET LAIT DE COCO)',
            blocks: new Array<TextBlock>({
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "POULET SAUCE"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "SATAY (CACAHUETES"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: " ET LAIT DE COCO)"
                    })
                })
        };

        test('on recognizeText returns the correct value', async () => {
            mockRecognizeText.mockResolvedValue(mockResultTitle);

            expect(await recognizeText(uriForOCR, recipeColumnsNames.title)).toEqual('POULET SAUCE SATAY (CACAHUETES ET LAIT DE COCO)');
        });
        test('on extractFieldFromImage return recipeTitle when OCR gives valid string', async () => {
            mockRecognizeText.mockResolvedValue(mockResultTitle);

            const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.title, baseState, mockWarn);
            expect(result).toEqual({recipeTitle: 'POULET SAUCE SATAY (CACAHUETES ET LAIT DE COCO)'});
            expect(mockWarn).not.toHaveBeenCalled();
        });
    });

    describe('on description field', () => {
        const mockResultDescription: TextRecognitionResult = {
            text: "La sauce satay est une sauce d'Asie du Sud-Est\nà base de cacahuètes, ail et gingembre !\nReproduisez-la pour accompagner\nnotre poulet français!",
            blocks: new Array<TextBlock>({
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "La sauce satay est une sauce d'Asie du Sud-Est"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "à base de cacahuètes, ail et gingembre !"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "Reproduisez-la pour accompagner"
                    })
                }, {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "notre poulet français!"
                    })
                })
        };
        const expectedDescription = "La sauce satay est une sauce d'Asie du Sud-Est à base de cacahuètes, ail et gingembre ! Reproduisez-la pour accompagner notre poulet français!";
        test('on recognizeText returns the correct value', async () => {

            mockRecognizeText.mockResolvedValue(mockResultDescription);

            expect(await recognizeText(uriForOCR, recipeColumnsNames.description)).toEqual(expectedDescription);
        });
        test('on extractFieldFromImage return recipeTitle when OCR gives valid string', async () => {
            mockRecognizeText.mockResolvedValue(mockResultDescription);

            const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.description, baseState, mockWarn);
            expect(result).toEqual({recipeDescription: expectedDescription});
            expect(mockWarn).not.toHaveBeenCalled();
        });
    });

    describe('on preparation field', () => {
        const mockResultPreparationQuitoque: TextRecognitionResult = {
            text: "1. LA PRÉPARATION\n•Émincez l'oignon.\n•Épluchez et coupez la carotte en demi-rondelles.\n•Coupez et retirez la base du poireau.\nIncisez-le en deux dans la longueur et rincez-le soigneusement. Émincez-le.\n•Retirez la partie racine de la citronnelle (5 cm environ). Émincez finement le reste.\n•Pressez ou hachez I'ail.\n•Egouttez et rincez les pois chiches.\n2. LE CURRY\n•Dans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon, le poireau, la carotte, I'ail, la citronnelle et les épices cachemire\n10 min environ. Salez, poivrez.\nAstuce: Ne remuez pas les légumes immédiatement après les avoir déposés dans la sauteuse,\nlaissez-les caraméliser quelques minutes pour obtenir une belle couleur dorée.\n• Au bout des 10 min, ajoutez le lait de coco et laissez mijoter 10 min à couvert.\n• Ajoutez la purée de tomates et les pois chiches égouttés et poursuivez la cuisson 10 min.\nSalez, poivrez.\n•Goûtez et rectifiez l'assaisonnement si nécessaire.\n•En parallèle, faites cuire le riz.\n3. LE RIZ\n•Portezà ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\n•Pendant ce temps, retirez la base de la cébette et émincez-la.\nParsemez-la sur le curry au moment de servir.",
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [],
                    text: "1. LA PRÉPARATION\n•Émincez l'oignon.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Epluchez et coupez la carotte en demi-rondelles.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Coupez et retirez la base du poireau.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Incisez-le en deux dans la longueur et rincez-le soigneusement. Émincez-le.\n•Retirez la partie racine de la citronnelle (5 cm environ). Émincez finement le reste.\n• Pressez ou hachez l'ail.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Egouttez et rincez les pois chiches.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "2. LE CURRY",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Dans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon, le poireau, la carotte, Il'ail, la citronnelle et les épices cachemire\n10 min environ. Salez, poivrez.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Astuce: Ne remuez pas les légumes immédiatement après les avoir déposés dans la sauteuse, laissez-les caraméliser quelques minutes pour obtenir une belle couleur dorée.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "• Au bout des 10 min, ajoutez le lait de coco et laissez mijoter 10 min à couvert.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "• Ajoutez la purée de tomates et les pois chiches égouttés et poursuivez la cuisson 10 min.\nSalez, poivrez.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "• Goûtez et rectifiez l'assaisonnement si nécessaire.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•En parallèle, faites cuire le riz.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [], text: "3. LE RIZ", lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Portez à ébullition une casserole d'eau salée.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Faites cuire le riz selon les indications du paquet.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "•Pendant ce temps, retirez la base de la cébette et émincez-la.\nParsemez-la sur le curry au moment de servir.",
                    lines: new Array<TextLine>()
                },
            )
        };
        const expectedPreparationQuitoque = new Array<string>("La préparation" + textSeparator + "•émincez l'oignon.\n•Epluchez et coupez la carotte en demi-rondelles.\n•Coupez et retirez la base du poireau.\nIncisez-le en deux dans la longueur et rincez-le soigneusement. Émincez-le.\n•Retirez la partie racine de la citronnelle (5 cm environ). Émincez finement le reste.\n• Pressez ou hachez l'ail.\n•Egouttez et rincez les pois chiches.",
            "Le curry" + textSeparator + "•Dans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon, le poireau, la carotte, Il'ail, la citronnelle et les épices cachemire\n10 min environ. Salez, poivrez.\nAstuce: Ne remuez pas les légumes immédiatement après les avoir déposés dans la sauteuse, laissez-les caraméliser quelques minutes pour obtenir une belle couleur dorée.\n• Au bout des 10 min, ajoutez le lait de coco et laissez mijoter 10 min à couvert.\n• Ajoutez la purée de tomates et les pois chiches égouttés et poursuivez la cuisson 10 min.\nSalez, poivrez.\n• Goûtez et rectifiez l'assaisonnement si nécessaire.\n•En parallèle, faites cuire le riz.",
            "Le riz" + textSeparator + "•Portez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\n•Pendant ce temps, retirez la base de la cébette et émincez-la.\nParsemez-la sur le curry au moment de servir.");
        const expectedPreparationHelloFresh = new Array<string>("Cuire le riz" + textSeparator + "Veillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette!\nPortez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.\nÉgouttez-le et réservez-le à couvert.",
            "Cuire les légumes" + textSeparator + "Pendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.\nFaites chauffer un filet d'huile d'olive à feu moyen-vif dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.\nCONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants",
            "Faire la sauce" + textSeparator + "Pendant ce temps, ciselez la ciboulette et l'ail séparément.\nRâpez le gingembre (si vous le souhaitez avec la peau).\nDans un bol, mélangez I'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne:1 cs de sucre et\n30 ml d'eau.\nCoupez le poulet en 3 aiguillettes.\nCONSEIL:Si vous faites attention à votre consommation de sel ou\nn'aimez pas manger trop salé, réduisez la quantité de sauce soja et de\ngomasio et ne salez pas le plat par la suite.",
            "Finir et servir" + textSeparator + "Faites chauffer un filet d'huile d'olive dans une poêle à feu moyen-vif et faites-y cuire le poulet 2-4 min.\nAjoutez la sauce et laissez-la réduire 1-2 min à feu vif, ou jusqu'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).\nServez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.\nSaupoudrez de ciboulette et de gomasio.\nA vos fourchettes!");

        const mockResultPreparationHelloFresh: TextRecognitionResult = {
            text: "1\nCuire le riz\nVeillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette!\nPortez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.\nÉgouttez-le et réservez-le à couvert.\n3\nFaire la sauce\nPendant ce temps, ciselez la ciboulette et l'ail séparément.\nRâpez le gingembre (si vous le souhaitez avec la peau).\nDans un bol, mélangez l'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne:1 cs de sucre et\n30 ml d'eau.\nCoupez le poulet en 3 aiguillettes.\nCONSEIL:Si vous faites attention à votre consommation de sel ou\nn'aimez pas manger trop salé, réduisez la quantité de sauce soja et de\ngomasio et ne salez pas le plat par la suite.\n2\nCuire les légumes\nPendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.\nFaites chauffer un filet d'huile d'olive à feu moyen-if dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.\nCONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants.\nFinir et servir\nFaites chauffer un filet d'huile d'olive dans une poêle à feu moyen-\nvif et faites-y cuire le poulet 2-4 min.\nAjoutez la sauce et laissez-la réduire 12 min à feu vif, ou jusqư'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).\nServez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.\nSaupoudrez de ciboulette et de gomasio.\nA vos fourchettes!",
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [], text: "1", lines: new Array<TextLine>()
                }, {
                    recognizedLanguages: [], text: "Cuire le riz", lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Veillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette!",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Portez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Égouttez-le et réservez-le à couvert.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "3",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [], text: "Faire la sauce", lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Pendant ce temps, ciselez la ciboulette et l'ail séparément.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Râpez le gingembre (si vous le souhaitez avec la peau).",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Dans un bol, mélangez I'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne:1 cs de sucre et\n30 ml d'eau.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Coupez le poulet en 3 aiguillettes.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "CONSEIL:Si vous faites attention à votre consommation de sel ou\nn'aimez pas manger trop salé, réduisez la quantité de sauce soja et de\ngomasio et ne salez pas le plat par la suite.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "2",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [], text: "Cuire les légumes", lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Pendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Faites chauffer un filet d'huile d'olive à feu moyen-vif dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "CONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "4",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Finir et servir",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Faites chauffer un filet d'huile d'olive dans une poêle à feu moyen-vif et faites-y cuire le poulet 2-4 min.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Ajoutez la sauce et laissez-la réduire 1-2 min à feu vif, ou jusqu'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Servez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "Saupoudrez de ciboulette et de gomasio.",
                    lines: new Array<TextLine>()
                },
                {
                    recognizedLanguages: [],
                    text: "A vos fourchettes!",
                    lines: new Array<TextLine>()
                },
            )
        };

        describe('on recognizeText', () => {
            test('(quitoque) returns the correct value', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPreparationQuitoque);

                const received = await recognizeText(uriForOCR, recipeColumnsNames.preparation);

                expect(received).toEqual(expectedPreparationQuitoque);
            });
            test('(hellofresh) returns the correct value', async () => {

                mockRecognizeText.mockResolvedValue(mockResultPreparationHelloFresh);

                const received = await recognizeText(uriForOCR, recipeColumnsNames.preparation);

                expect(received).toEqual(expectedPreparationHelloFresh);
            });
        });

        describe('on extractFieldFromImage', () => {
            test(' (quitoque) return recipePreparation with new steps', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPreparationQuitoque);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.preparation, {
                    ...baseState,
                    recipePreparation: ['Existing step']
                }, mockWarn);

                expect(result).toEqual({recipePreparation: ['Existing step', ...expectedPreparationQuitoque]});
            });
            test(' (hellofresh) return recipePreparation with new steps', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPreparationHelloFresh);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.preparation, {...baseState}, mockWarn);

                expect(result).toEqual({recipePreparation: expectedPreparationHelloFresh});
            });
        });


    });

    describe('on ingredient field', () => {
        const mockResultIngredientNominal: TextRecognitionResult = {
            text: "cacahuètes grillées (g)\nconcentré de tomates (g)\nfilet de poulet\ngingembre (cm)\ngoussed'ail\nlait de coco (mL)\noignon jaune\noignon nouveau\nriz basmati (g) Bio\n2p\n100\n35\n2\n1à3\n1\n200\n1\n0.5\n150\n3p\n150\n35\n3\n1à3\n1\n200\n1\n1\n225\n4p\n200\n70\n4\n1à3\n2\n400\n2\n1\n300\n5p\n250\n70\n5\n1à3\n2\n400\n2\n2\n375",
            blocks: new Array<TextBlock>({
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "cacahuètes grillées (g)"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "concentré de tomates (g)"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "filet de poulet"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "gingembre (cm)"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "goussed'ail"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "lait de coco (mL)"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "oignon jaune"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "oignon nouveau"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "riz basmati (g) Bio"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "2p"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "100"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "35"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1à3"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "200"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "0.5"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "150"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "3p"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "150"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "35"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "3"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1à3"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "200"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "225"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "4p"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "200"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "70"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "4"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1à3"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "400"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "300"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "5p"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "250"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "70"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "5"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "1à3"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "400"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "2"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "375"
                    })
                },
            )
        };
        const mockIngredientsNoHeader: TextRecognitionResult = {
            text: "Some random text without a valid header token",
            blocks: [
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: [
                        {elements: [], recognizedLanguages: [], text: "ingredient1 (g)"},
                        {elements: [], recognizedLanguages: [], text: "ingredient2 (ml)"}
                    ]
                }
            ]
        };
        const mockIncompleteGroup: TextRecognitionResult = {
            text: "ingredient1 (g)\ningredient2 (ml)\n2p\n100",
            blocks: [
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: [
                        {elements: [], recognizedLanguages: [], text: "ingredient1 (g)"},
                        {elements: [], recognizedLanguages: [], text: "ingredient2 (ml)"},
                        {elements: [], recognizedLanguages: [], text: "2p"},
                        {elements: [], recognizedLanguages: [], text: "100"}
                    ]
                }
            ]
        };
        const mockExtraWhitespace: TextRecognitionResult = {
            text: "  ingredient1 (g)  \n   ingredient2   \n  2p   \n  100   \n   200  ",
            blocks: [
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: [
                        {elements: [], recognizedLanguages: [], text: "  ingredient1 (g)  "},
                        {elements: [], recognizedLanguages: [], text: "   ingredient2   "},
                        {elements: [], recognizedLanguages: [], text: "  2p   "},
                        {elements: [], recognizedLanguages: [], text: "  100   "},
                        {elements: [], recognizedLanguages: [], text: "   200  "}
                    ]
                }
            ]
        };
        const mockEmptyOcr: TextRecognitionResult = {text: "", blocks: []};

        describe('on recognizeText', () => {
            test('returns the correct value on nominal case', async () => {

                mockRecognizeText.mockResolvedValue(mockResultIngredientNominal);

                const expectedNominal = new Array<ingredientObject>(
                    {
                        name: "cacahuètes grillées",
                        unit: "g",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "100"}, {
                            persons: 3,
                            quantity: "150"
                        }, {persons: 4, quantity: "200"}, {persons: 5, quantity: "250"}),
                    },
                    {
                        name: "concentré de tomates",
                        unit: "g",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "35"}, {
                            persons: 3,
                            quantity: "35"
                        }, {persons: 4, quantity: "70"}, {persons: 5, quantity: "70"}),
                    },
                    {
                        name: "filet de poulet",
                        unit: "",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "2"}, {
                            persons: 3,
                            quantity: "3"
                        }, {persons: 4, quantity: "4"}, {persons: 5, quantity: "5"}),
                    },
                    {
                        name: "gingembre",
                        unit: "cm",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "1à3"}, {
                            persons: 3,
                            quantity: "1à3"
                        }, {persons: 4, quantity: "1à3"}, {persons: 5, quantity: "1à3"}),
                    },
                    {
                        name: "goussed'ail",
                        unit: "",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "1"}, {
                            persons: 3,
                            quantity: "1"
                        }, {persons: 4, quantity: "2"}, {persons: 5, quantity: "2"}),
                    },
                    {
                        name: "lait de coco",
                        unit: "mL",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "200"}, {
                            persons: 3,
                            quantity: "200"
                        }, {persons: 4, quantity: "400"}, {persons: 5, quantity: "400"}),
                    },
                    {
                        name: "oignon jaune",
                        unit: "",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "1"}, {
                            persons: 3,
                            quantity: "1"
                        }, {persons: 4, quantity: "2"}, {persons: 5, quantity: "2"}),
                    },
                    {
                        name: "oignon nouveau",
                        unit: "",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "0.5"}, {
                            persons: 3,
                            quantity: "1"
                        }, {persons: 4, quantity: "1"}, {persons: 5, quantity: "2"}),
                    },
                    {
                        name: "riz basmati  Bio",
                        unit: "g",
                        quantityPerPersons: new Array<ingredientQuantityPerPersons>({persons: 2, quantity: "150"}, {
                            persons: 3,
                            quantity: "225"
                        }, {persons: 4, quantity: "300"}, {persons: 5, quantity: "375"}),
                    },
                );

                const received = await recognizeText(uriForOCR, recipeColumnsNames.ingredients);

                expect(received).toEqual(expectedNominal);
            });
            test("throw error if no header (token ending with 'p') is found", async () => {
                mockRecognizeText.mockResolvedValue(mockIngredientsNoHeader);

                await expect(recognizeText(uriForOCR, recipeColumnsNames.ingredients)).rejects.toThrow("No ingredient header found in OCR data.");
            });
            test("throw error when OCR result is empty", async () => {
                mockRecognizeText.mockResolvedValue(mockEmptyOcr);
                await expect(recognizeText(uriForOCR, recipeColumnsNames.ingredients)).rejects.toThrow("No ingredient header found in OCR data.");
            });
            test("ignore incomplete data rows", async () => {
                // With two ingredients, group size should be 3 tokens (persons + 2 quantities).
                // Here we provide an incomplete group (only persons and one quantity).
                mockRecognizeText.mockResolvedValue(mockIncompleteGroup);

                // Expect header parsed but no quantities attached because the data group is incomplete.
                const expected = new Array<ingredientObject>(
                    {name: "ingredient1", unit: "g", quantityPerPersons: []},
                    {name: "ingredient2", unit: "ml", quantityPerPersons: []}
                );

                const result = await recognizeText(uriForOCR, recipeColumnsNames.ingredients);
                expect(result).toEqual(expected);
            });
            test("trim extra whitespace from lines", async () => {

                mockRecognizeText.mockResolvedValue(mockExtraWhitespace);

                const expected = new Array<ingredientObject>(
                    {name: "ingredient1", unit: "g", quantityPerPersons: [{persons: 2, quantity: "100"}]},
                    {name: "ingredient2", unit: "", quantityPerPersons: [{persons: 2, quantity: "200"}]}
                );

                const result = await recognizeText(uriForOCR, recipeColumnsNames.ingredients);
                expect(result).toEqual(expected);
            });
        });

        describe('on extractFieldFromImage', () => {
            test('parse ingredients with exact match for persons', async () => {
                mockRecognizeText.mockResolvedValue(mockResultIngredientNominal);

                const result = await extractFieldFromImage('uri', recipeColumnsNames.ingredients, baseState, mockWarn);
                expect(result).toEqual({
                    recipeIngredients: new Array<ingredientTableElement>({
                            ingName: "cacahuètes grillées",
                            unit: "g",
                            season: [],
                            type: ingredientType.undefined,
                            quantity: "200",
                        },
                        {
                            ingName: "concentré de tomates",
                            unit: "g", season: [],
                            type: ingredientType.undefined,
                            quantity: "70",
                        },
                        {
                            ingName: "filet de poulet",
                            unit: "", season: [],
                            type: ingredientType.undefined,
                            quantity: "4"
                        },
                        {
                            ingName: "gingembre",
                            unit: "cm", season: [],
                            type: ingredientType.undefined,
                            quantity: "1à3",
                        },
                        {
                            ingName: "goussed'ail",
                            unit: "", season: [],
                            type: ingredientType.undefined,
                            quantity: "2",
                        },
                        {
                            ingName: "lait de coco",
                            unit: "mL", season: [],
                            type: ingredientType.undefined,
                            quantity: "400",
                        },
                        {
                            ingName: "oignon jaune",
                            unit: "", season: [],
                            type: ingredientType.undefined,
                            quantity: "2",
                        },
                        {
                            ingName: "oignon nouveau",
                            unit: "", season: [],
                            type: ingredientType.undefined,
                            quantity: "1",
                        },
                        {
                            ingName: "riz basmati  Bio",
                            unit: "g", season: [],
                            type: ingredientType.undefined,
                            quantity: "300",
                        })
                });
            });
        });


    });

    describe('on person and time field', () => {
        const mockResultTimes: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "25 min"
                    })
                },
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "25 min"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "30 min"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "30 min"
                    })
                },
            )
        };
        const expectedTimes = new Array<number>(25, 25, 30, 30);

        const mockResultTime: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>({
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({elements: [], recognizedLanguages: [], text: "25 min"})
                },
            )
        };
        const expectedTime = 25;

        const mockResultPersonsTimes: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2 pers."
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "3 pers."
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "4 pers."
                    })
                },
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "5 pers."
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: ">"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "25 min"
                    })
                },
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "25 min"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "30 min"
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "30 min"
                    })
                },
            )
        };
        const expectedPersonsTimes = new Array<personAndTimeObject>({person: 2, time: 25}, {person: 3, time: 25}, {
            person: 4,
            time: 30
        }, {person: 5, time: 30});


        const mockResultPersonTime: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2 pers."
                    })
                },

                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "25 min"
                    })
                },
            )
        };
        const expectedPersonTime = new Array<personAndTimeObject>({person: 2, time: 25});

        const mockResultPersons: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>(
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "2 pers."
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "3 pers."
                    })
                },
                {
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({
                        elements: [], recognizedLanguages: [], text: "4 pers."
                    })
                },
                {
                    recognizedLanguages: [], text: "", lines: new Array<TextLine>({
                        elements: [],
                        recognizedLanguages: [],
                        text: "5 pers."
                    })
                },
            )
        };
        const expectedPersons = new Array<number>(2, 3, 4, 5);

        const mockResultPerson: TextRecognitionResult = {
            text: '2 pers.\n3 pers.\n4 pers.\n5 pers. \n>\n25 min\n25 min\n30 min\n30 min',
            blocks: new Array<TextBlock>({
                    recognizedLanguages: [],
                    text: "",
                    lines: new Array<TextLine>({elements: [], recognizedLanguages: [], text: "2 pers."})
                },
            )
        };
        const expectedPerson = 2;

        describe('on recognizeText', () => {
            test(' returns array of time if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultTimes);

                expect(await recognizeText(uriForOCR, recipeColumnsNames.time)).toEqual(expectedTimes);
            });
            test('returns a single time if it is the only value available', async () => {

                mockRecognizeText.mockResolvedValue(mockResultTime);

                expect(await recognizeText(uriForOCR, recipeColumnsNames.time)).toEqual(expectedTime);
            });
            test('returns array of time and persons if the values are  availables', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersonsTimes);


                expect(await recognizeText(uriForOCR, recipeColumnsNames.persons)).toEqual(expectedPersonsTimes);
                expect(await recognizeText(uriForOCR, recipeColumnsNames.time)).toEqual(expectedPersonsTimes);
            });
            test('returns a single time and person if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersonTime);

                expect(await recognizeText(uriForOCR, recipeColumnsNames.time)).toEqual(expectedPersonTime);
                expect(await recognizeText(uriForOCR, recipeColumnsNames.persons)).toEqual(expectedPersonTime);
            });
            test('returns array of persons if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersons);

                expect(await recognizeText(uriForOCR, recipeColumnsNames.persons)).toEqual(expectedPersons);
            });
            test('returns a single value of person if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPerson);

                expect(await recognizeText(uriForOCR, recipeColumnsNames.persons)).toEqual(expectedPerson);
            });
        });

        describe('on recognizeText', () => {
            test('extractFieldFromImage returns time if it is the only value available (even with an array)', async () => {
                mockRecognizeText.mockResolvedValue(mockResultTimes);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.time, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25});
            });
            test('extractFieldFromImage returns a time if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultTime);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.time, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25});
            });
            test('extractFieldFromImage returns time and persons if the values are  availables (even with an array)', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersonsTimes);

                let result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.time, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25, recipePersons: 2,});

                result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.persons, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25, recipePersons: 2,});
            });
            test('extractFieldFromImage returns time and person if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersonTime);

                let result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.time, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25, recipePersons: 2,});

                result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.persons, baseState, mockWarn);
                expect(result).toEqual({recipeTime: 25, recipePersons: 2,});
            });
            test('extractFieldFromImage returns person if it is the only value available (even with an array)', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPersons);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.persons, baseState, mockWarn);
                expect(result).toEqual({recipePersons: 2});
            });
            test('extractFieldFromImage returns a person if it is the only value available', async () => {
                mockRecognizeText.mockResolvedValue(mockResultPerson);

                const result = await extractFieldFromImage(uriForOCR, recipeColumnsNames.persons, baseState, mockWarn);
                expect(result).toEqual({recipePersons: 2});
            });
        });

    });

    test('extractFieldFromImage log error for unrecognized field', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const result = await extractFieldFromImage(uriForOCR, 'not-a-field' as any, baseState, mockWarn);

        expect(result).toEqual({});
        expect(spy).toHaveBeenCalledWith('Unrecognized field', 'not-a-field');
        spy.mockRestore();
    });
});
