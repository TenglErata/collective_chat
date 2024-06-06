import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { useRouter } from 'vue-router'
import CryptoJS from "crypto-js";
import NCA from '@/crypto'
import errorMusic from "@/assets/sound/error.mp3"
import connectingMusic from "@/assets/sound/connecting.mp3"
import Cookies from 'js-cookie'
import nca from '@/crypto'

export const appStore = defineStore('store', () => {
    const searchBar = ref('')

    const isModalReady = reactive({
        isAllData: false,
        isConfirm: null,
        currentWarning: null
    })

    const selectArray = ref([])
    const selectFile = reactive({
        file: null,
        scribe: false
    })

    const modifyElement = reactive({
      type: null,
      id: null,
      action: null
    })

    const subWindow = reactive({
        type: '',
        windowName: '',
        position: {
            x: null,
            y: null
        }
    })

    const warningList = reactive({
        wrongRoomName: { active: false,  text: 'Room is exists!'},
        selectOtherMessages: []
    })

    const subWindowType = reactive({
        dialogueRoomName: [
            { name: 'Create', icon: 'ri-file-add-line'},
            { name: 'Delete', icon: 'ri-delete-bin-line'},
            { name: 'Rename', icon: 'ri-arrow-up-double-line'}
        ],
        dialogueList: [
            { name: 'Create', icon: 'ri-file-add-line'},
        ],
        dialogueYourMessage: [
            { name: 'Forward',  icon: 'ri-share-forward-fill'},
            { name: 'Reply',    icon: 'ri-reply-fill'},
            { name: 'Delete',   icon: 'ri-delete-bin-line'},
            { name: 'Edit',     icon: 'ri-arrow-up-double-line'},
            { name: 'Select',   icon: 'ri-check-line'},
        ],
        dialogueMessage: [
            { name: 'Forward',  icon: 'ri-share-forward-fill'},
            { name: 'Reply',    icon: 'ri-reply-fill'},
        ]
    })

    const selectButtons = ref([
        {name: 'Delete',    icon: 'ri-delete-bin-line'},
        {name: 'Forward',   icon: 'ri-share-forward-fill'},
        {name: 'Cancel',    icon: 'ri-close-line'}
    ])

    const buttonArray = reactive({
        'ri-mic-off-fill': false,
        'ri-volume-mute-fill': false
    })

    const roomArray = ref([])
    const roomMessages = ref([])

    const msgSignature = reactive({
        ownerName: '',
        isValid: null
    })

    const router = useRouter()
    const user = reactive({
        name: '',
        status: 'ri-circle-line',
        room: 'Default'
    })

    const socket = ref(null)

        function socketListeners () {
            socket.value.on('responseAuth', (initData, userName, token) => {
                if (initData == true) {
                    Cookies.set('auth_token', token)
                    console.log(token)
                    user.name = userName
                    router.push('/main')
                    // new Audio(connectingMusic).play()
                } else {
                    // new Audio(errorMusic).play()
                }
            })

            socket.value.on('getRooms', initRooms => {
                roomArray.value = []
                for (const key in initRooms) {
                    roomArray.value.push({
                        active: initRooms[key].some(element => element.name == user.name),
                        name: key,
                        users: initRooms[key]
                    })
                }
            })
            socket.value.on('getMessages', initMessages => {
                roomMessages.value = initMessages
            })
            socket.value.on('getFile', initFile => {
                console.log(initFile)
            })
        //    -------------------------------------------------
            let fileData = [];
            let fileName = '';

            socket.value.on('fileData', (chunk) => {
                fileName = chunk.fileName;
                fileData.push(chunk.data);
            });

            socket.value.on('fileEnd', ({fileName, openData}) => {
                const blob = new Blob(fileData);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);

                const reader = new FileReader();
                reader.onload = function(event) {
                    const hash = CryptoJS.SHA256(event.target.result).toString(CryptoJS.enc.Hex);
                    console.log(hash, openData)

                    const nca = new NCA()
                    msgSignature.ownerName = openData['user']
                    if (nca.verify(openData['signature'], JSON.parse(openData['publicKey'])) == hash)
                        msgSignature.isValid = true
                    else
                        msgSignature.isValid = false
                };
                reader.readAsArrayBuffer(blob);
            });

            socket.value.on('error', (message) => {
                console.error(message);
                alert(message);
            });
    }

    return {
        msgSignature, searchBar, selectFile, selectArray, selectButtons, warningList, isModalReady, socket, modifyElement, subWindowType, subWindow, user, roomMessages, roomArray, buttonArray,
        socketListeners

    }
})