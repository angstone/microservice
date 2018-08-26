const TAFFY = require('taffy').taffy;
const uid = require('uuid/v1');

const sessionModel = {
  load: ['auth'],
  data: TAFFY([]),
  methods: {

    reborn: ()=>{
      sessionModel.data = TAFFY([]);
    },

    openSession: (user_id, device_id)=>{
      const session = {
        user_id,
        device_id,
        created_at: Date.now(),
        token: uid(),

      };
    }

  },
};

module.exports = sessionModel;
