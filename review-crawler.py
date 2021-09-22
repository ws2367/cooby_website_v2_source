import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import json

baseUrl = 'https://chrome.google.com/webstore/detail/whatsapp-tabs-by-cooby/hcikfoejbgdmajlbhadhfchoekcoablm'

options = Options()
options.add_argument('--disable-notifications')

chrome = webdriver.Chrome('./chromedriver', chrome_options=options)
chrome.get(baseUrl)

print('waiting for 2s...')
time.sleep(2)

reviewBtn = chrome.find_element_by_id(':1a')
reviewBtn.click()

soup = BeautifulSoup(chrome.page_source, 'html.parser') #將網頁資料以html.parser

result = []
reviewBlocks = soup.find_all('div', { 'class': 'ba-bc-Xb' })
for review in reviewBlocks:
  stars = review.find_all('div', { 'class': 'rsw-starred' })
  if len(stars) == 5 or len(stars) == 4:
    data = {}
    
    thumbnail = review.find('img', { 'class': 'Lg-ee-A-O-xb' })
    if thumbnail['src'].split('//')[0] == 'https:':
      data['thumbnail'] = thumbnail['src']
    else:
      data['thumbnail'] = 'https:' + thumbnail['src']
    

    reviewer = review.find('span', { 'class': 'comment-thread-displayname' })
    data['reviewer'] = reviewer.getText()
    
    content = review.find('div', { 'class': 'ba-Eb-ba' })
    data['content'] = content.getText()

    data['stars'] = len(stars)

    result.append(data)

with open('./src/reviews.json', 'w', encoding='utf-8') as file:
  file.write(json.dumps(result, indent=2, ensure_ascii=False))

chrome.quit()