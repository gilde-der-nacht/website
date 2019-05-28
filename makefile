
# assume that there is an environemnt variable HUGO which contains the hugo executable
# e.g. export HUGO=/mnt/c/Users/Tom/AppData/Local/Microsoft/WindowsApps/hugo.exe
# TODO autodetect path

build:
	cd websites/gilde-der-nacht ; $(HUGO)
	cd websites/luzerner-rollenspieltage ; $(HUGO)
	#cd websites/luzerner-spieltage ; $(HUGO)
	#cd websites/luzerner-tabletoptage ; $(HUGO)
