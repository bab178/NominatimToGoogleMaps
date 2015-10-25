f = open('AustinPts2.txt', 'r')
g = open('AustinPts3.txt', 'w')

content = f.read()
switch = 0

# for i in content:
	# if(i == ',' and switch == 1):
		# g.write('\n')
		# switch = 0
	# elif i == ',':
		# switch = 1
		# g.write(i)
	# else:
		# g.write(i)
	# if(i == ' '):
		# g.write('\n')
	# else:
		# g.write(i)

c = 0
x = content.split('\n')
g.write("{")
for i in x:
	y = i.split(',')
	if(c < 6):
		g.write("\"{lat: "+ y[1] +", lng: "+y[0]+"}\","),
		c+=1
	else:
		g.write("\"{lat: "+ y[1] +", lng: "+y[0]+"}\",\n")
		c = 0
	
	
g.write("}")