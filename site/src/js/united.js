const data = {}
const rpc_addr = 'https://florencenet.smartpy.io/'//'https://api.tez.ie/rpc/florencenet'
const network = "florencenet"

const contract_addr = 'KT1HENdSq6gnGcsY73ib2sGmhbbPR5gyRW1n'
let user_addr = ''

let contract = false
const statuses = ['Proposed', 'Confirmed', 'Rejected', 'Violates copyright']
const votes = ['yes', 'no']

const max_mint_amount = 1000000
const max_mint_length = 128

const max_max_report_url = 512
const max_max_report_author = 64

const min_voted_users = 3 //100
const min_voted_on_report = 2 //30
const min_voted_time = 300 //1209600
const voted_positive_percent = 0.7

let dom_loaded = false
let data_loaded = false
let storage_loaded = false
