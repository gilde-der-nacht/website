#!/usr/bin/env python3

import argparse
import os
import subprocess
import json
import tempfile
import shutil

parser = argparse.ArgumentParser(description='')
parser.add_argument('--publish', dest='publish', action='store')

args = parser.parse_args()

script_dir = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(script_dir, 'configs', 'config.json')) as file:
    config = json.load(file)

subprocess.check_call(
    ['docker', 'build', os.path.join(script_dir, 'docker', 'hugo'), '--tag', 'hugo-docker'])

with tempfile.TemporaryDirectory() as tmpdir:
    for website in config['websites']:
        public_dir = os.path.join(tmpdir, website, 'public')
        os.makedirs(public_dir)

        subprocess.check_call([
            'docker',
            'run',
            '--rm',
            '--volume',
            '{}:{}'.format(script_dir, '/hugo'),
            '--volume',
            '{}:{}'.format(public_dir, '/hugo-destination'),
            'hugo-docker',
            'hugo',
            '--source',
            '/hugo/websites/{}'.format(website),
            '--destination',
            '/hugo-destination/'
        ])

    for website in config['websites']:
        cloned_dir = os.path.join(tmpdir, website, 'cloned')
        os.makedirs(cloned_dir)
        subprocess.check_call([
            'git',
            'clone',
            'git@github.com:gilde-der-nacht/test.{}.git'.format(website),
            cloned_dir
        ])
        list_dir = os.listdir(cloned_dir)

        for entry in [os.path.join(cloned_dir, entry)
                      for entry in list_dir if entry not in ['.git', 'CNAME']]:
            if os.path.isdir(entry):
                shutil.rmtree(entry)
            else:
                os.unlink(entry)

        for entry in os.listdir(public_dir):
            os.rename(os.path.join(public_dir, entry),
                      os.path.join(cloned_dir, entry))

        subprocess.check_call(['git', 'add', '.'], cwd=cloned_dir)
        subprocess.check_call(['git', 'commit', '-m', 'Test'], cwd=cloned_dir)
        subprocess.check_call(['git', 'push'], cwd=cloned_dir)

    subprocess.check_call(['bash'], cwd=tmpdir)
