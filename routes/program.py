#!/usr/bin/env python
# coding: utf-8

# In[1]:


get_ipython().system('pip install websockets')
get_ipython().system('pip install pyserial')
get_ipython().system('pip install mysql-connector-python')


# In[1]:


# WebSocket 서버 Python
import asyncio
import nest_asyncio
import websockets
import json
nest_asyncio.apply()  # 중첩 asyncio 이벤트 루프를 사용하도록 설정

async def handle_client(websocket, path):
    global userId

    def set_global_user_id(message):
        global userId
        userId = message
        print("로그인")
        print(userId)

    try:
        async for message in websocket:
            if message is None or message == "":
                print("로그아웃")
                userId = "unknown"
                await websocket.close()
            else:
                set_global_user_id(message)
                await websocket.close()
            
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"Connection closed with error: {e}")

        
start_server = websockets.serve(handle_client, "0.0.0.0", 3334)

asyncio.run(start_server)





# # In[ ]:


# import pandas as pd
# from datetime import datetime
# import mysql.connector
# import joblib
# import serial

# # 모델을 로드합니다.
# model_filename = "./knn_posture.pkl"
# knn = joblib.load(model_filename)


# # 모델 예측을 기반으로 포스트처를 분류하는 함수를 정의합니다.
# def classify_posture(sensor_data, knn):
#     posture = knn.predict(sensor_data)
#     return posture

# # 데이터베이스에 연결합니다.
# conn = mysql.connector.connect(
#     host="project-db-campus.smhrd.com",
#     user="campus_23IS_IoT1_hack_1",
#     password="smhrd1",
#     database="campus_23IS_IoT1_hack_1",
#     port=3307
# )
# cursor = conn.cursor()
# ser = serial.Serial('COM7', 115200)
# def posturemap(posture):
#     if posture ==['1'] :
#         posture_info = "correct"
#     elif posture ==['2']:
#         posture_info = "left"
#     elif posture ==['3'] :
#         posture_info = "right"
#     elif posture ==['4'] :
#         posture_info = "turtle"
#     elif posture ==['5'] :
#         posture_info = "bent"
#     elif posture ==['6'] :
#         posture_info = "unflat"
#     else : 
#         posture_info = "분류할수없습니다"
#     return posture_info
  

# try:
#     while True:
#         data = ser.readline().decode('utf-8').strip()
#         sensor_values = [int(sv) for sv in data.split(',')]

#         # 'sensor_values'를 DataFrame으로 변환합니다.
#         sensor_data = pd.DataFrame([sensor_values], columns=[f'Sensor{i}' for i in range(1, 32)])

#         # 포스트처를 분류합니다.
#         posture = classify_posture(sensor_data,knn)

#         # 현재 날짜와 시간을 가져옵니다.
#         current_date = datetime.now().date()
#         current_time = datetime.now().time()

   
    
#         # 'sensordata' 테이블에 데이터를 삽입합니다.
   

#         sensor_columns = ', '.join([f'p{i}' for i in range(1, 32)])
#         posture_info = posturemap(posture)
             
#         try:
#             cursor.execute("""
#             INSERT INTO sensordata  
#             (userId, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, postureInfo, createdAt)
#             VALUES 
#             (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
#             """, [user_id] + sensor_values + [posture_info])
#             conn.commit()
#         except mysql.connector.Error as err:
#             print( f"1번오류: {err}")
    
#         try:
#             cursor.execute("""
#                 INSERT INTO postureclassification (userId, postureInfo, postureDate, postureTime)
#                 VALUES (%s, %s, %s, %s)
#             """, [user_id, posture_info, current_date, current_time])
#             conn.commit()
#             print(posture_info)
#         except mysql.connector.Error as err:
#             print(f"오류: {err}")

# except KeyboardInterrupt:
#     ser.close()
#     cursor.close() 
#     conn.close()

