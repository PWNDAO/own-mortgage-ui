<template>
    <div class="border px-3 sm:px-4 py-2 order-3 lg:order-none">
        <!-- note: using unmount-on-hide="false" to make sure the image is downloaded immediately right after the page is opened -->
        <Accordion :default-value="[ACCORDION_ITEMS_ID.WHAT_IS_BORDEL]" type="multiple" :unmount-on-hide="false">
            <AccordionItem v-for="item in ACCORDION_ITEMS" :key="item.id" :value="item.id">
                <AccordionTrigger class="font-heading text-base sm:text-lg md:text-xl font-semibold cursor-pointer">
                    <span style="margin-top: -4px;">{{ item.title }}</span>
                </AccordionTrigger>
                <AccordionContent>
                    <template v-if="item.id === ACCORDION_ITEMS_ID.WHAT_IS_BORDEL">
                        <p class="leading-relaxed text-sm sm:text-base">
                            Bordel Hackerspace is a community-driven creators' space in Prague that has been nurturing creativity, experimentation, and education in technology, art, and science for over three years. 
                            Founded by passionate hackers and builders from the Ethereum community, it has become a hub for cypherpunks, scientists, and artists to access tools and collaborate on free and open projects. 
                            Despite challenges like relocation, Bordel continues to push forward its mission to support public-benefit innovation and community growth.
                        </p>

                        <div class="my-4 flex justify-center">
                            <img src="/images/bordel-gif.gif" alt="Bordel Hackerspace" class="w-full sm:w-3/4 md:w-1/2"/>
                        </div>

                        <a href="https://bordel.wtf" target="_blank">
                            <Button variant="outline" class="w-full">
                                <span>Visit Bordel Website</span>
                                <img
                                    src="/icons/external.svg"
                                    alt="Bordel Hackerspace Link"
                                    class="w-4 h-4 transition-all duration-200 group-hover:brightness-0 group-hover:invert"
                                    style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);"
                                />
                            </Button>
                        </a>
                    </template>
                    <template v-else-if="item.id === ACCORDION_ITEMS_ID.MORTGAGE_FUNCTIONALITY">
                        <p class="leading-relaxed text-sm sm:text-base mb-4">
                            This mortgage is a decentralized, crowdfunded DeFi loan designed to bootstrap community projects by leveraging crypto collateral (WETH) with a 75% loan-to-value ratio over two years. 
                            Supporters lend stablecoins (EURS) at a modest interest rate of 2%, receiving gradual loan repayments along with non-monetary rewards like memberships and event access. 
                            By distributing risk across many lenders instead of relying on one, this setup encourages community involvement and ensures more accessible and sustainable funding.
                        </p>

                        <a href="https://mirror.xyz/bordel.eth/1i5LGBtPm-HbCAZCTcUUWneU_99YIQMtO3BxxYMU1h4" target="_blank">
                            <Button variant="outline" class="w-full">
                                <span>Learn More About Bordel Mortgage</span>
                                <img
                                    src="/icons/external.svg"
                                    alt="Bordel Hackerspace Link"
                                    class="w-4 h-4 transition-all duration-200 group-hover:brightness-0 group-hover:invert"
                                    style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);"
                                />
                            </Button>
                        </a>
                    </template>
                    <template v-else-if="item.id === ACCORDION_ITEMS_ID.LOAN_DEFAULT">
                        <LoanDefaultGraph />
                    </template>
                    <template v-else>
                        UNKNOWN ACCORDION ITEM!!!
                    </template>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script lang="ts" setup>

enum ACCORDION_ITEMS_ID {
    WHAT_IS_BORDEL = 'what-is-bordel',
    MORTGAGE_FUNCTIONALITY = 'mortgage-functionality',
    LOAN_DEFAULT = 'loan-default',
}
const ACCORDION_ITEMS = [
    { id: ACCORDION_ITEMS_ID.WHAT_IS_BORDEL, title: "What Is Bordel Hackerspace?" },
    { id: ACCORDION_ITEMS_ID.MORTGAGE_FUNCTIONALITY, title: "How Does The Mortgage Work?" },
    { id: ACCORDION_ITEMS_ID.LOAN_DEFAULT, title: "Loan Default" },
]
</script>
