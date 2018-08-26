const TAFFY = require('taffy').taffy;

const userModel = {
  SYSTEM_AGENT: {
    id: 1,
    name: 'SYSTEM AGENT',
    login: 'system_god_user',
    password: null,
    password_confirmation: null,
    created_at: null,
  },
  data: TAFFY([]),
  methods: {
    reborn: ()=>{
      userModel.data = TAFFY([SYSTEM_AGENT]);
    },
  },
};

module.exports = userModel;
