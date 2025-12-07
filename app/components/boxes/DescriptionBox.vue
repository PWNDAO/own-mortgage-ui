<template>
    <div class="bg-card border rounded-xl px-3 sm:px-4 py-2 order-2 lg:order-none shadow-lg">
        <h3 class="font-heading text-xl sm:text-2xl mb-3">Story</h3>
        <!-- note: using unmount-on-hide="false" to make sure the image is downloaded immediately right after the page is opened -->
        <Accordion :default-value="[ACCORDION_ITEMS_ID.WHAT_IS_BORDEL]" type="multiple" :unmount-on-hide="false">
            <AccordionItem :value="ACCORDION_ITEMS_ID.WHAT_IS_BORDEL">
                <AccordionTrigger class="font-heading text-base sm:text-lg md:text-xl font-semibold cursor-pointer">
                    <span style="margin-top: -4px;">What Is Bordel Hackerspace?</span>
                </AccordionTrigger>
                <AccordionContent>
                    <p class="leading-relaxed text-sm sm:text-base text-justify">
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
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="members">
                <AccordionTrigger class="font-heading text-base sm:text-lg md:text-xl font-semibold cursor-pointer">
                    <span style="margin-top: -4px;">Members</span>
                </AccordionTrigger>
                <AccordionContent>
                    <div class="space-y-4 pt-2">
                        <div v-for="member in MEMBERS" :key="member.twitter" class="flex gap-3 border rounded-lg p-3 bg-background/50 hover:bg-background/70 transition-colors">
                            <a :href="`https://x.com/${member.twitter}`" target="_blank" class="flex-shrink-0">
                                <img :src="member.profileImage" :alt="member.name" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-600 hover:border-primary-foreground transition-colors" />
                            </a>
                            <div class="flex-grow min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <a :href="`https://x.com/${member.twitter}`" target="_blank" class="font-semibold text-white hover:text-primary-foreground transition-colors truncate">
                                        {{ member.name }}
                                    </a>
                                    <a :href="`https://x.com/${member.twitter}`" target="_blank" class="text-gray-400 hover:text-primary-foreground transition-colors flex-shrink-0">
                                        <img src="/icons/external.svg" alt="Twitter Link" class="w-3 h-3" style="filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(89%);" />
                                    </a>
                                </div>
                                <p class="text-xs sm:text-sm text-gray-300 text-justify">{{ member.bio }}</p>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script lang="ts" setup>

enum ACCORDION_ITEMS_ID {
    WHAT_IS_BORDEL = 'what-is-bordel',
}

interface Member {
    name: string
    twitter: string
    profileImage: string
    bio: string
}

const MEMBERS: Member[] = [
    {
        name: 'Chao TMI',
        twitter: 'TMIYChao',
        profileImage: 'https://pbs.twimg.com/profile_images/1741948237850099712/jGWuVSg0_400x400.jpg',
        bio: 'Building at the intersection of technology and community. Passionate about Web3 and decentralized innovation.'
    },
    {
        name: 'Josef J',
        twitter: 'JosefJ_',
        profileImage: 'https://pbs.twimg.com/profile_images/1445897891576737792/vF4K5Nve_400x400.jpg',
        bio: 'Hacker, builder, and community organizer. Co-founder of Bordel Hackerspace, exploring the future of decentralized collaboration.'
    }
]
</script>
